import { useEffect, useRef, useState } from 'react'
import { BASE_MAP, mapTextMarks, markerColors, specialTagLabels } from './data'
import { IconDoor, IconLandmark, IconMinus, IconPin, IconPlus } from './icons'
import type { Poi } from './types'

const SELECTED_COLOR = '#e95f2f'
const MIN_ZOOM = 0.6
const MAX_ZOOM = 3
const clampZoom = (v: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v))

interface Props {
  pois: Poi[]
  selectedId?: string
  panelOpen: boolean
  /** 放置模式：点击地图选择位置（编辑用） */
  placing: boolean
  draftPos?: { x: number; y: number }
  onSelect(poi: Poi): void
  onPlace(pos: { x: number; y: number }): void
}

export function CampusMap({ pois, selectedId, panelOpen, placing, draftPos, onSelect, onPlace }: Props) {
  const [zoom, setZoom] = useState(1)
  const [loaded, setLoaded] = useState(false)
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const zoomRef = useRef(1)
  zoomRef.current = zoom
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ dist: number; zoom: number } | null>(null)
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  const zoomAt = (clientX: number, clientY: number, next: number) => {
    const vp = viewport.current
    if (!vp) return
    const clamped = clampZoom(next)
    const prev = zoomRef.current
    if (clamped === prev) return
    const rect = vp.getBoundingClientRect()
    const ox = clientX - rect.left
    const oy = clientY - rect.top
    const ratio = clamped / prev
    const left = (vp.scrollLeft + ox) * ratio - ox
    const top = (vp.scrollTop + oy) * ratio - oy
    zoomRef.current = clamped
    setZoom(clamped)
    // 等新尺寸生效后再设置滚动位置，保持缩放中心不动
    requestAnimationFrame(() => {
      vp.scrollLeft = left
      vp.scrollTop = top
    })
  }

  const zoomBy = (factor: number) => {
    const rect = viewport.current?.getBoundingClientRect()
    if (rect) zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, zoomRef.current * factor)
  }

  // Ctrl / ⌘ + 滚轮缩放（需要非 passive 监听才能阻止页面缩放）
  useEffect(() => {
    const vp = viewport.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      zoomAt(e.clientX, e.clientY, zoomRef.current * Math.exp(-e.deltaY * 0.01))
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    requestAnimationFrame(() => {
      vp.scrollLeft = (vp.scrollWidth - vp.clientWidth) / 2
      vp.scrollTop = (vp.scrollHeight - vp.clientHeight) / 2
    })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  // 选中地点后把它滚动到视野中（避开详情面板）
  const selected = pois.find((p) => p.id === selectedId)
  useEffect(() => {
    if (!selected || !loaded) return
    const t = setTimeout(() => {
      const vp = viewport.current
      const cv = canvas.current
      if (!vp || !cv) return
      const vr = vp.getBoundingClientRect()
      const cr = cv.getBoundingClientRect()
      const cx = cr.left - vr.left + vp.scrollLeft + (cr.width * selected.position.x) / 100
      const cy = cr.top - vr.top + vp.scrollTop + (cr.height * selected.position.y) / 100
      const mobile = window.innerWidth < 640
      vp.scrollTo({ left: cx - vr.width * (mobile ? 0.5 : 0.42), top: cy - vr.height * (mobile ? 0.3 : 0.5), behavior: 'smooth' })
    }, 240)
    return () => clearTimeout(t)
  }, [selected?.id, selected?.position.x, selected?.position.y, loaded])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !viewport.current) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    e.currentTarget.setPointerCapture(e.pointerId)
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { dist: Math.hypot(b.x - a.x, b.y - a.y), zoom: zoomRef.current }
      drag.current = null
      suppressClick.current = true
      return
    }
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: viewport.current.scrollLeft, top: viewport.current.scrollTop, moved: false }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const vp = viewport.current
    if (!vp) return
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(b.x - a.x, b.y - a.y)
      if (dist > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, pinch.current.zoom * (dist / pinch.current.dist))
      return
    }
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true
    vp.scrollLeft = d.left - dx
    vp.scrollTop = d.top - dy
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointers.current.delete(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (drag.current?.id === e.pointerId) {
      suppressClick.current = drag.current.moved
      drag.current = null
    }
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    if (!placing) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 10000) / 100
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 10000) / 100
    onPlace({ x, y })
  }

  return (
    <div className="um-map">
      <div ref={viewport} className="um-viewport">
        <div className={`um-stage${panelOpen ? ' um-panel-offset' : ''}`}>
          <div ref={canvas} className="um-canvas" style={{ ['--um-zoom' as string]: zoom, aspectRatio: `${BASE_MAP.width} / ${BASE_MAP.height}` }}>
            <img alt="深圳大学城矢量地图底图" src={BASE_MAP.src} width={BASE_MAP.width} height={BASE_MAP.height} draggable={false} decoding="async" onLoad={() => setLoaded(true)} ref={(el) => {
                if (el?.complete && !loaded) setLoaded(true)
              }} />
            <div
              className={`um-overlay${placing ? ' um-placing' : ''}`}
              onClick={onClick}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {mapTextMarks.map((m) => (
                <span key={m.id} aria-hidden="true" className="um-textmark" style={{ left: `${m.position.x}%`, top: `${m.position.y}%`, transform: `translate(-50%, -50%) rotate(${m.rotate ?? 0}deg)` }}>
                  {m.text}
                </span>
              ))}
              {pois.map((poi) => {
                const isSide = poi.specialTags?.includes('hit-teaching-side-entrance')
                const isLandmark = poi.specialTags?.includes('landmark')
                const label = isSide ? specialTagLabels['hit-teaching-side-entrance'] : isLandmark ? specialTagLabels.landmark : undefined
                const code = poi.buildingCodes?.[0]
                return (
                  <button
                    key={poi.id}
                    type="button"
                    className="um-marker"
                    aria-label={label ? `${poi.name}，${label}` : poi.name}
                    title={label ? `${poi.name} · ${label}` : poi.name}
                    style={{ left: `${poi.position.x}%`, top: `${poi.position.y}%`, backgroundColor: poi.id === selectedId ? SELECTED_COLOR : markerColors[poi.category] }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(poi)
                    }}
                  >
                    {isLandmark ? <IconLandmark size={18} strokeWidth={2.5} /> : code ? <span className="um-code">{code}</span> : isSide ? <IconDoor size={18} strokeWidth={2.5} /> : <IconPin size={18} strokeWidth={2.5} />}
                  </button>
                )
              })}
              {draftPos && <span className="um-marker um-draft" style={{ left: `${draftPos.x}%`, top: `${draftPos.y}%` }} />}
            </div>
          </div>
        </div>
      </div>
      <div className="um-zoom">
        <button type="button" aria-label="放大地图" onClick={() => zoomBy(1.25)}>
          <IconPlus />
        </button>
        <button type="button" aria-label="缩小地图" onClick={() => zoomBy(0.8)}>
          <IconMinus />
        </button>
      </div>
    </div>
  )
}
