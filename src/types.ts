export type PoiCategory = 'building' | 'canteen' | 'cafe' | 'service' | 'sport' | 'study' | 'leisure' | 'landmark'
export type PoiSpecialTag = 'hit-teaching-side-entrance' | 'landmark'
export type CampusId = 'hit' | 'pku' | 'tsinghua'

export interface PoiPhoto {
  /** 站内地址：/plugins/utsz-map/... 或 /uploads/... */
  src: string
  caption?: string
}

export interface Poi {
  id: string
  name: string
  campus?: CampusId
  buildingCodes?: string[]
  category: PoiCategory
  /** 底图上的相对坐标（百分比） */
  position: { x: number; y: number }
  photos: PoiPhoto[]
  specialTags?: PoiSpecialTag[]
  description: string
  entranceHint?: string
  /** 位置或信息尚待核实 */
  needsReview?: boolean
}

export interface RelatedDoc {
  id: string
  title: string
}

export interface BuildingCodeOption {
  campus: CampusId
  code: string
  aliases?: string[]
}

export interface MapTextMark {
  id: string
  text: string
  position: { x: number; y: number }
  rotate?: number
}
