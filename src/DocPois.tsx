import type { DocPanelProps } from '@outflow/sdk/web'
import { useEffect, useMemo, useState } from 'react'
import { mapApi, poiHref } from './api'
import { IconPin, IconX } from './icons'
import type { Poi } from './types'

/** 编辑页中的「相关地点」：所有人可见；能编辑文档的人可以增删 */
export function DocPois({ docId, canEdit }: DocPanelProps) {
  const [linked, setLinked] = useState<Poi[] | null>(null)
  const [all, setAll] = useState<Poi[] | null>(null)
  const [picking, setPicking] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    setLinked(null)
    mapApi
      .docPois(docId)
      .then((r) => setLinked(r.pois))
      .catch(() => setLinked([]))
  }, [docId])

  useEffect(() => {
    if (picking && !all) mapApi.pois().then((r) => setAll(r.pois))
  }, [picking, all])

  const candidates = useMemo(() => {
    const term = q.trim().toLowerCase()
    const ids = new Set(linked?.map((p) => p.id))
    return (all ?? []).filter((p) => !ids.has(p.id) && (!term || p.name.toLowerCase().includes(term) || p.buildingCodes?.some((c) => c.toLowerCase() === term))).slice(0, 8)
  }, [all, linked, q])

  const save = async (ids: string[]) => {
    try {
      setLinked((await mapApi.setDocPois(docId, ids)).pois)
    } catch (e) {
      alert((e as Error).message)
    }
  }

  if (!linked || (!linked.length && !canEdit)) return null
  return (
    <section className="um-docpois">
      <h2>相关地点</h2>
      <div className="um-chips">
        {linked.map((p) => (
          <span key={p.id} className="um-chip">
            <a href={poiHref(p.id)}>
              <IconPin size={14} /> {p.name}
            </a>
            {canEdit && (
              <button title="移除" onClick={() => save(linked.filter((x) => x.id !== p.id).map((x) => x.id))}>
                <IconX size={13} />
              </button>
            )}
          </span>
        ))}
        {canEdit && !picking && (
          <button className="btn btn-sm" onClick={() => setPicking(true)}>
            关联地点
          </button>
        )}
        {!linked.length && !picking && <span className="muted small">把攻略关联到地图上的地点，读者可以从地点找到这篇攻略。</span>}
      </div>
      {picking && (
        <div className="um-picker">
          <input className="input" autoFocus placeholder="搜索地点名称或楼栋编号" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && setPicking(false)} />
          <ul>
            {!all && <li className="muted small">加载中…</li>}
            {all && !candidates.length && <li className="muted small">没有匹配的地点</li>}
            {candidates.map((p) => (
              <li key={p.id}>
                <button
                  onClick={async () => {
                    await save([...linked.map((x) => x.id), p.id])
                    setQ('')
                  }}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
          <button className="btn btn-sm" onClick={() => setPicking(false)}>
            完成
          </button>
        </div>
      )}
    </section>
  )
}
