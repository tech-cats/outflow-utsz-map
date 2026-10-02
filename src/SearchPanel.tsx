import { buildingCodeOptions, campusLabels, categoryLabels, categoryOrder } from './data'
import { IconPin, IconSearch } from './icons'
import type { Poi, PoiCategory } from './types'

interface Props {
  pois: Poi[]
  query: string
  category: PoiCategory | 'all'
  selectedId?: string
  onQuery(q: string): void
  onCategory(c: PoiCategory | 'all'): void
  onSelect(poi: Poi): void
}

export function SearchPanel(props: Props) {
  return (
    <aside className="um-panel um-search">
      <div className="um-search-head">
        <label className="um-search-input">
          <IconSearch />
          <input type="search" placeholder="搜索建筑、入口、食堂" value={props.query} autoFocus onChange={(e) => props.onQuery(e.target.value)} />
        </label>
        <div className="um-scroll-row">
          <span className="um-row-label"># 编号</span>
          {buildingCodeOptions.map((b) => (
            <button key={`${b.campus}-${b.code}`} type="button" className="um-pill" title={`${campusLabels[b.campus]} ${b.code}`} onClick={() => props.onQuery(b.code)}>
              {b.code}
            </button>
          ))}
        </div>
        <div className="um-scroll-row">
          {(['all', ...categoryOrder] as const).map((c) => (
            <button key={c} type="button" className={`um-pill um-pill-lg${props.category === c ? ' on' : ''}`} onClick={() => props.onCategory(c)}>
              {c === 'all' ? '全部' : categoryLabels[c]}
            </button>
          ))}
        </div>
      </div>
      <div className="um-search-list">
        {!props.pois.length && (
          <div className="um-empty">
            <p>没有匹配的地点</p>
            <p className="small">试试换个关键词或切换分类</p>
          </div>
        )}
        {props.pois.map((poi) => (
          <button key={poi.id} type="button" className={`um-item${props.selectedId === poi.id ? ' on' : ''}`} onClick={() => props.onSelect(poi)}>
            <span className="um-item-cat">
              <IconPin size={13} /> {categoryLabels[poi.category]}
            </span>
            <strong>{poi.name}</strong>
            {!!poi.buildingCodes?.length && (
              <span className="um-tags">
                {poi.buildingCodes.map((c) => (
                  <span key={c} className="um-code-tag">
                    {c}
                  </span>
                ))}
                {poi.campus && <span className="um-campus-tag">{campusLabels[poi.campus]}</span>}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  )
}
