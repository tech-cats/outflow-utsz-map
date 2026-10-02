import { Topbar } from '@outflow/sdk/web'
import { useEffect, useMemo, useState } from 'react'
import { mapApi } from './api'
import { CampusMap } from './CampusMap'
import { buildingCodeOptions, campusLabels } from './data'
import { IconMenu, IconPlus, IconX } from './icons'
import { PoiDetail } from './PoiDetail'
import { PoiEditor } from './PoiEditor'
import { SearchPanel } from './SearchPanel'
import type { Poi, PoiCategory } from './types'

const searchText = (p: Poi) =>
  [
    p.name,
    p.campus ? campusLabels[p.campus] : '',
    ...buildingCodeOptions.filter((b) => p.buildingCodes?.includes(b.code)).flatMap((b) => [b.code, ...(b.aliases ?? [])]),
  ]
    .join(' ')
    .toLowerCase()

const poiFromUrl = () => new URLSearchParams(location.search).get('poi') ?? undefined

function setUrl(id?: string) {
  const url = id ? `/map?poi=${encodeURIComponent(id)}` : '/map'
  if (location.pathname + location.search !== url) history.pushState(null, '', url)
}

/** 编辑状态：draft 为正在编辑的地点；placing 表示下一次点击地图将设置它的位置 */
interface EditState {
  draft: Poi
  isNew: boolean
  placing: boolean
}

export default function MapPage() {
  const [pois, setPois] = useState<Poi[] | null>(null)
  const [canEdit, setCanEdit] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<PoiCategory | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | undefined>(poiFromUrl)
  const [searchOpen, setSearchOpen] = useState(false)
  const [edit, setEdit] = useState<EditState | null>(null)
  /** 新增地点：等待在地图上点选位置 */
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    document.title = '地图'
    mapApi
      .pois()
      .then((r) => {
        setPois(r.pois)
        setCanEdit(r.canEdit)
      })
      .catch((e) => setError((e as Error).message))
    const onPop = () => setSelectedId(poiFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return (pois ?? []).filter((p) => (category === 'all' || p.category === category) && (!term || searchText(p).includes(term)))
  }, [pois, query, category])

  const selected = pois?.find((p) => p.id === selectedId)

  const select = (poi?: Poi) => {
    setSelectedId(poi?.id)
    setUrl(poi?.id)
    setEdit(null)
    setAdding(false)
    if (poi && window.innerWidth < 640) setSearchOpen(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || (e.target as HTMLElement)?.closest?.('input, textarea, select')) return
      if (edit) setEdit(null)
      else if (adding) setAdding(false)
      else if (selectedId) select(undefined)
      else setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const startAdd = () => {
    select(undefined)
    setSearchOpen(false)
    setAdding(true)
  }

  const onPlace = (pos: { x: number; y: number }) => {
    if (adding) {
      setAdding(false)
      const id = `poi-${Date.now().toString(36)}`
      setEdit({ draft: { id, name: '', category: 'building', position: pos, photos: [], description: '' }, isNew: true, placing: false })
    } else if (edit?.placing) {
      setEdit({ ...edit, draft: { ...edit.draft, position: pos }, placing: false })
    }
  }

  const save = async (poi: Poi) => {
    const r = await mapApi.savePoi(poi)
    setPois((list) => [...(list ?? []).filter((p) => p.id !== r.poi.id), r.poi])
    setEdit(null)
    setSelectedId(r.poi.id)
    setUrl(r.poi.id)
  }

  const remove = async (id: string) => {
    await mapApi.deletePoi(id)
    setPois((list) => (list ?? []).filter((p) => p.id !== id))
    select(undefined)
  }

  // 编辑中：地图上显示草稿位置，原地点暂时隐藏
  const shown = edit ? filtered.filter((p) => p.id !== edit.draft.id) : filtered
  const placing = adding || !!edit?.placing

  return (
    <>
      <Topbar />
      <div className="um-root">
        <CampusMap
          pois={shown}
          selectedId={selectedId}
          panelOpen={!!(selected || edit)}
          placing={placing}
          draftPos={edit?.draft.position}
          onSelect={(p) => !edit && select(p)}
          onPlace={onPlace}
        />

        <div className="um-toolbar">
          <button type="button" className="um-icon-btn" aria-expanded={searchOpen} aria-label={searchOpen ? '收起搜索' : '搜索地点'} onClick={() => setSearchOpen(!searchOpen)}>
            {searchOpen ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>
          <div className="um-title">
            <small>UTSZ MAP</small>
            <strong>大学城互动地图</strong>
          </div>
          {canEdit && !edit && (
            <button type="button" className={`btn btn-sm${adding ? ' on' : ''}`} onClick={() => (adding ? setAdding(false) : startAdd())}>
              <IconPlus size={14} /> {adding ? '取消' : '新增地点'}
            </button>
          )}
        </div>

        {placing && <div className="um-tip">{adding ? '点击地图，选择新地点的位置' : '点击地图，设置地点的新位置'}</div>}
        {error && <div className="um-tip um-tip-error">{error}</div>}

        {searchOpen && !edit && (
          <SearchPanel pois={filtered} query={query} category={category} selectedId={selectedId} onQuery={setQuery} onCategory={setCategory} onSelect={select} />
        )}

        {edit ? (
          <PoiEditor
            key={edit.draft.id}
            draft={edit.draft}
            isNew={edit.isNew}
            placing={edit.placing}
            onChange={(draft) => setEdit({ ...edit, draft })}
            onTogglePlacing={() => setEdit({ ...edit, placing: !edit.placing })}
            onSave={save}
            onDelete={() => remove(edit.draft.id)}
            onCancel={() => setEdit(null)}
          />
        ) : (
          selected && (
            <PoiDetail
              poi={selected}
              canEdit={canEdit}
              onClose={() => select(undefined)}
              onEdit={() => setEdit({ draft: structuredClone(selected), isNew: false, placing: false })}
              onMove={() => setEdit({ draft: structuredClone(selected), isNew: false, placing: true })}
            />
          )
        )}
      </div>
    </>
  )
}
