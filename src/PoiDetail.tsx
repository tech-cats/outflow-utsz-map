import { useEffect, useRef, useState } from 'react'
import { mapApi } from './api'
import { campusLabels, categoryLabels, specialTagHints, specialTagLabels } from './data'
import { IconCameraOff, IconChevronLeft, IconChevronRight, IconCrosshair, IconDoor, IconPencil, IconX } from './icons'
import type { Poi, RelatedDoc } from './types'

interface Props {
  poi: Poi
  canEdit: boolean
  onClose(): void
  onEdit(): void
  onMove(): void
}

function EmptyPhoto({ label = '暂无实拍' }: { label?: string }) {
  return (
    <div className="um-photo-empty">
      <IconCameraOff size={34} strokeWidth={1.8} />
      <span>{label}</span>
    </div>
  )
}

export function PoiDetail({ poi, canEdit, onClose, onEdit, onMove }: Props) {
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState(false)
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [docs, setDocs] = useState<RelatedDoc[] | null>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const sheetY = useRef<number | null>(null)
  const photos = poi.photos
  const photo = photos[Math.min(index, photos.length - 1)]

  useEffect(() => {
    setIndex(0)
    setExpanded(false)
    setDocs(null)
    mapApi
      .poiDocs(poi.id)
      .then((r) => setDocs(r.docs))
      .catch(() => setDocs([]))
  }, [poi.id])

  // 预加载相邻照片
  useEffect(() => {
    if (photos.length < 2) return
    for (const off of [1, -1]) new Image().src = photos[(index + off + photos.length) % photos.length].src
  }, [index, photos])

  const step = (d: 1 | -1) => photos.length > 1 && setIndex((i) => (i + d + photos.length) % photos.length)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${location.origin}/map?poi=${encodeURIComponent(poi.id)}`)
      setCopy('copied')
    } catch {
      setCopy('failed')
    }
    setTimeout(() => setCopy('idle'), 1600)
  }

  const hints = (poi.specialTags ?? []).filter((t) => specialTagHints[t])

  return (
    <section className={`um-panel um-detail${expanded ? ' expanded' : ''}`}>
      <div
        className="um-sheet-handle"
        onPointerDown={(e) => {
          sheetY.current = e.clientY
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerUp={(e) => {
          if (sheetY.current === null) return
          const dy = e.clientY - sheetY.current
          sheetY.current = null
          setExpanded(Math.abs(dy) <= 8 ? !expanded : dy < 0)
        }}
        onPointerCancel={() => (sheetY.current = null)}
      >
        <span />
      </div>

      {!photo ? (
        <EmptyPhoto />
      ) : (
        <div
          className="um-photo"
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            if (!touch.current) return
            const dx = e.changedTouches[0].clientX - touch.current.x
            const dy = e.changedTouches[0].clientY - touch.current.y
            touch.current = null
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1)
          }}
        >
          {failed.has(photo.src) ? (
            <EmptyPhoto label="图片加载失败" />
          ) : (
            <img alt={photo.caption ?? poi.name} src={photo.src} decoding="async" draggable={false} onError={() => setFailed((s) => new Set(s).add(photo.src))} />
          )}
          {photos.length > 1 && (
            <div className="um-photo-nav">
              <button type="button" aria-label="上一张实拍" onClick={() => step(-1)}>
                <IconChevronLeft size={19} />
              </button>
              <button type="button" aria-label="下一张实拍" onClick={() => step(1)}>
                <IconChevronRight size={19} />
              </button>
            </div>
          )}
          {(photo.caption || photos.length > 1) && (
            <div className="um-photo-caption">
              {photo.caption && <p>{photo.caption}</p>}
              {photos.length > 1 && (
                <div className="um-dots">
                  {photos.map((_, i) => (
                    <button key={i} type="button" aria-label={`查看第 ${i + 1} 张实拍`} className={i === index ? 'on' : ''} onClick={() => setIndex(i)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="um-detail-body">
        <div className="um-detail-head">
          <div>
            <div className="um-cat">{categoryLabels[poi.category]}</div>
            <h2>{poi.name}</h2>
          </div>
          <button type="button" className="um-icon-btn" aria-label="关闭地点详情" onClick={onClose}>
            <IconX />
          </button>
        </div>

        {poi.needsReview && <p className="um-review">位置或信息尚待核实</p>}
        {poi.description && <p className="um-desc">{poi.description}</p>}

        {!!poi.buildingCodes?.length && (
          <div className="um-box">
            <div className="um-box-title">教学楼编号</div>
            <div className="um-tags">
              {poi.buildingCodes.map((c) => (
                <span key={c} className="um-code-tag">
                  {c}
                </span>
              ))}
              {poi.campus && <span className="um-campus-tag">{campusLabels[poi.campus]}</span>}
            </div>
          </div>
        )}

        {hints.map((t) => (
          <div key={t} className="um-hint">
            <div className="um-box-title">
              <IconDoor size={16} /> {specialTagLabels[t]}
            </div>
            <p>{specialTagHints[t]}</p>
          </div>
        ))}

        {poi.entranceHint && <p className="um-entrance">{poi.entranceHint}</p>}

        {!!docs?.length && (
          <div className="um-docs">
            <div className="um-box-title">相关攻略</div>
            <ul>
              {docs.map((d) => (
                <li key={d.id}>
                  <a href={`/d/${d.id}`}>{d.title || '无标题'}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="um-detail-foot">
          <button type="button" className="link" onClick={copyLink}>
            {copy === 'copied' ? '已复制链接' : copy === 'failed' ? '复制失败' : '复制链接'}
          </button>
          {canEdit && (
            <span className="um-edit-actions">
              <button type="button" className="btn btn-sm" onClick={onMove}>
                <IconCrosshair size={14} /> 调整位置
              </button>
              <button type="button" className="btn btn-sm" onClick={onEdit}>
                <IconPencil size={14} /> 编辑
              </button>
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
