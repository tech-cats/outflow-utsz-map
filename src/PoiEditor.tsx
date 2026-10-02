import { uploadPublicImage } from '@outflow/sdk/web'
import { useState } from 'react'
import { campusLabels, categoryLabels, categoryOrder, specialTagLabels } from './data'
import { IconCrosshair, IconX } from './icons'
import type { CampusId, Poi, PoiSpecialTag } from './types'

interface Props {
  draft: Poi
  isNew: boolean
  placing: boolean
  onChange(p: Poi): void
  onTogglePlacing(): void
  onSave(poi: Poi): Promise<void>
  onDelete(): Promise<void>
  onCancel(): void
}

export function PoiEditor({ draft, isNew, placing, onChange, onTogglePlacing, onSave, onDelete, onCancel }: Props) {
  const [busy, setBusy] = useState(false)
  const [codes, setCodes] = useState((draft.buildingCodes ?? []).join(', '))
  const set = (patch: Partial<Poi>) => onChange({ ...draft, ...patch })
  const setPhotos = (photos: Poi['photos']) => set({ photos })

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const upload = (files: FileList | null) =>
    run(async () => {
      const added = []
      for (const f of [...(files ?? [])]) added.push({ src: await uploadPublicImage(f), caption: '' })
      setPhotos([...draft.photos, ...added])
    })

  const move = (i: number, d: -1 | 1) => {
    const list = [...draft.photos]
    const j = i + d
    if (j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j], list[i]]
    setPhotos(list)
  }

  const toggleTag = (t: PoiSpecialTag) => {
    const tags = new Set(draft.specialTags ?? [])
    if (tags.has(t)) tags.delete(t)
    else tags.add(t)
    set({ specialTags: [...tags] })
  }

  return (
    <section className="um-panel um-detail um-editor expanded">
      <div className="um-detail-body">
        <div className="um-detail-head">
          <h2>{isNew ? '新增地点' : '编辑地点'}</h2>
          <button type="button" className="um-icon-btn" aria-label="取消编辑" onClick={onCancel}>
            <IconX />
          </button>
        </div>

        <form
          className="um-form"
          onSubmit={(e) => {
            e.preventDefault()
            const buildingCodes = codes.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean)
            void run(() => onSave({ ...draft, buildingCodes }))
          }}
        >
          <label className="field">
            <span>名称</span>
            <input className="input" required maxLength={60} value={draft.name} onChange={(e) => set({ name: e.target.value })} />
          </label>
          <div className="um-form-row">
            <label className="field">
              <span>分类</span>
              <select className="input" value={draft.category} onChange={(e) => set({ category: e.target.value as Poi['category'] })}>
                {categoryOrder.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>校区</span>
              <select className="input" value={draft.campus ?? ''} onChange={(e) => set({ campus: (e.target.value || undefined) as CampusId | undefined })}>
                <option value="">（无）</option>
                {(Object.keys(campusLabels) as CampusId[]).map((c) => (
                  <option key={c} value={c}>
                    {campusLabels[c]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>楼栋编号（逗号分隔，如 T4, H）</span>
            <input className="input" value={codes} onChange={(e) => setCodes(e.target.value)} />
          </label>
          <label className="field">
            <span>说明</span>
            <textarea className="input" rows={3} maxLength={2000} value={draft.description} onChange={(e) => set({ description: e.target.value })} />
          </label>
          <label className="field">
            <span>入口提示</span>
            <textarea className="input" rows={2} maxLength={500} value={draft.entranceHint ?? ''} onChange={(e) => set({ entranceHint: e.target.value })} />
          </label>
          <div className="um-checks">
            {(Object.keys(specialTagLabels) as PoiSpecialTag[]).map((t) => (
              <label key={t}>
                <input type="checkbox" checked={draft.specialTags?.includes(t) ?? false} onChange={() => toggleTag(t)} /> {specialTagLabels[t]}
              </label>
            ))}
            <label>
              <input type="checkbox" checked={!!draft.needsReview} onChange={(e) => set({ needsReview: e.target.checked })} /> 待核实
            </label>
          </div>

          <div className="field">
            <span>位置</span>
            <div className="um-form-row um-pos">
              <span className="muted small">
                x {draft.position.x}%，y {draft.position.y}%
              </span>
              <button type="button" className={`btn btn-sm${placing ? ' on' : ''}`} onClick={onTogglePlacing}>
                <IconCrosshair size={14} /> {placing ? '点击地图选择位置…' : '在地图上选择'}
              </button>
            </div>
          </div>

          <div className="field">
            <span>实拍照片</span>
            <ul className="um-photo-list">
              {draft.photos.map((ph, i) => (
                <li key={ph.src + i}>
                  <img src={ph.src} alt="" />
                  <input className="input input-sm" placeholder="照片说明" maxLength={60} value={ph.caption ?? ''} onChange={(e) => setPhotos(draft.photos.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} />
                  <span className="um-photo-ops">
                    <button type="button" title="上移" disabled={i === 0} onClick={() => move(i, -1)}>
                      ↑
                    </button>
                    <button type="button" title="下移" disabled={i === draft.photos.length - 1} onClick={() => move(i, 1)}>
                      ↓
                    </button>
                    <button type="button" title="移除" onClick={() => setPhotos(draft.photos.filter((_, j) => j !== i))}>
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <label className="btn btn-sm um-upload">
              上传照片
              <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" multiple hidden onChange={(e) => upload(e.target.files)} />
            </label>
          </div>

          <div className="um-form-actions">
            <button className="btn btn-primary btn-sm" disabled={busy}>
              保存
            </button>
            <button type="button" className="btn btn-sm" onClick={onCancel}>
              取消
            </button>
            {!isNew && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                disabled={busy}
                onClick={() => confirm(`删除地点「${draft.name}」？关联的攻略会自动解除关联。`) && void run(onDelete)}
              >
                删除
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
