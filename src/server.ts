import type { PluginRequest, ServerPlugin } from '@outflow/sdk/server'
import { campusLabels, categoryLabels, seedPois, specialTagLabels } from './data'
import type { Poi, PoiPhoto } from './types'

/**
 * 存储：
 *  poi/<id>       地点
 *  doc-pois/<id>  某篇文档关联的地点 id 列表
 *  meta/seeded    是否已写入初始数据
 */

const ID_RE = /^[a-z0-9][a-z0-9-]{0,59}$/
const PHOTO_SRC_RE = /^\/(plugins\/utsz-map\/[A-Za-z0-9_./-]+|uploads\/[a-z0-9]+)$/

async function allPois(req: PluginRequest): Promise<Poi[]> {
  const store = req.store<Poi>('poi')
  const meta = req.store<boolean>('meta')
  if (!(await meta.get('seeded'))) {
    for (const p of seedPois) await store.put(p.id, p)
    await meta.put('seeded', true)
  }
  return (await store.list()).map((x) => x.value)
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/** 校验并规范化编辑提交的地点 */
function parsePoi(id: string, b: Record<string, unknown>): Poi | string {
  if (!ID_RE.test(id)) return '地点 id 只能包含小写字母、数字和连字符'
  const name = str(b.name, 60)
  if (!name) return '请填写地点名称'
  const category = b.category as Poi['category']
  if (!(category in categoryLabels)) return '分类无效'
  const pos = b.position as { x?: unknown; y?: unknown } | undefined
  const x = Number(pos?.x)
  const y = Number(pos?.y)
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) return '位置无效'
  const photos: PoiPhoto[] = []
  for (const ph of Array.isArray(b.photos) ? b.photos.slice(0, 12) : []) {
    const src = str((ph as PoiPhoto)?.src, 200)
    if (!PHOTO_SRC_RE.test(src)) return '照片地址无效'
    const caption = str((ph as PoiPhoto)?.caption, 60)
    photos.push(caption ? { src, caption } : { src })
  }
  const poi: Poi = {
    id,
    name,
    category,
    position: { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 },
    photos,
    description: str(b.description, 2000),
  }
  if (typeof b.campus === 'string' && b.campus in campusLabels) poi.campus = b.campus as Poi['campus']
  const codes = Array.isArray(b.buildingCodes) ? b.buildingCodes.map((c) => str(c, 10)).filter(Boolean).slice(0, 10) : []
  if (codes.length) poi.buildingCodes = codes
  const tags = Array.isArray(b.specialTags) ? b.specialTags.filter((t): t is NonNullable<Poi['specialTags']>[number] => typeof t === 'string' && t in specialTagLabels) : []
  if (tags.length) poi.specialTags = [...new Set(tags)]
  const hint = str(b.entranceHint, 500)
  if (hint) poi.entranceHint = hint
  if (b.needsReview === true) poi.needsReview = true
  return poi
}

async function linkedPois(req: PluginRequest, docId: string): Promise<Poi[]> {
  const ids = (await req.store<string[]>('doc-pois').get(docId)) ?? []
  if (!ids.length) return []
  const byId = new Map((await allPois(req)).map((p) => [p.id, p]))
  return ids.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : []))
}

const plugin: ServerPlugin = {
  api(app, host) {
    app.get('/pois', async (c) => {
      const req = host.get(c)
      return c.json({ pois: await allPois(req), canEdit: req.hasRole('editor') })
    })

    app.put('/pois/:id', host.requireRole('editor'), async (c) => {
      const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null
      const poi = parsePoi(c.req.param('id'), body ?? {})
      if (typeof poi === 'string') return c.json({ error: poi }, 400)
      const req = host.get(c)
      await allPois(req) // 确保初始数据已写入，避免之后被覆盖
      await req.store<Poi>('poi').put(poi.id, poi)
      return c.json({ poi })
    })

    app.delete('/pois/:id', host.requireRole('editor'), async (c) => {
      const req = host.get(c)
      const id = c.req.param('id')
      await allPois(req)
      await req.store<Poi>('poi').delete(id)
      // 同时解除与文档的关联
      const links = req.store<string[]>('doc-pois')
      for (const { key, value } of await links.list()) {
        if (value.includes(id)) {
          await links.put(key, value.filter((x) => x !== id))
          await req.purgeDocPage(key)
        }
      }
      return c.json({ ok: true })
    })

    /** 地点的相关攻略（只返回当前用户可读的） */
    app.get('/pois/:id/docs', async (c) => {
      const req = host.get(c)
      const id = c.req.param('id')
      const docIds = (await req.store<string[]>('doc-pois').list()).filter((x) => x.value.includes(id)).map((x) => x.key)
      return c.json({ docs: await req.docs.readable(docIds) })
    })

    app.get('/docs/:docId/pois', async (c) => {
      const req = host.get(c)
      const access = await req.docs.access(c.req.param('docId'))
      if (!access?.readable) return c.json({ error: '文档不存在' }, 404)
      return c.json({ pois: await linkedPois(req, access.id), canEdit: access.editable })
    })

    app.put('/docs/:docId/pois', host.requireUser, async (c) => {
      const req = host.get(c)
      const access = await req.docs.access(c.req.param('docId'))
      if (!access?.readable) return c.json({ error: '文档不存在' }, 404)
      if (!access.editable) return c.json({ error: '没有编辑权限' }, 403)
      const body = (await c.req.json().catch(() => null)) as { poiIds?: unknown } | null
      const known = new Set((await allPois(req)).map((p) => p.id))
      const ids = Array.isArray(body?.poiIds) ? [...new Set(body.poiIds.filter((x): x is string => typeof x === 'string' && known.has(x)))].slice(0, 20) : []
      const links = req.store<string[]>('doc-pois')
      if (ids.length) await links.put(access.id, ids)
      else await links.delete(access.id)
      await req.purgeDocPage(access.id)
      return c.json({ pois: await linkedPois(req, access.id) })
    })
  },

  async docSection(req, doc) {
    const pois = await linkedPois(req, doc.id)
    if (!pois.length) return null
    const e = req.escape
    const chips = pois
      .map((p) => `<a class="badge" href="/map?poi=${encodeURIComponent(p.id)}">📍 ${e(p.name)}</a>`)
      .join('')
    return `<h2 class="plugin-title">相关地点</h2><div class="chip-list">${chips}</div>`
  },
}

export default plugin
