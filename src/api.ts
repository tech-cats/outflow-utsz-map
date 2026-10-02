import { pluginApi } from '@outflow/sdk/web'
import type { Poi, RelatedDoc } from './types'

const call = pluginApi('utsz-map')

export const mapApi = {
  pois: () => call<{ pois: Poi[]; canEdit: boolean }>('/pois'),
  savePoi: (poi: Poi) => call<{ poi: Poi }>(`/pois/${encodeURIComponent(poi.id)}`, { method: 'PUT', body: poi }),
  deletePoi: (id: string) => call(`/pois/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  poiDocs: (id: string) => call<{ docs: RelatedDoc[] }>(`/pois/${encodeURIComponent(id)}/docs`),
  docPois: (docId: string) => call<{ pois: Poi[]; canEdit: boolean }>(`/docs/${docId}/pois`),
  setDocPois: (docId: string, poiIds: string[]) => call<{ pois: Poi[] }>(`/docs/${docId}/pois`, { method: 'PUT', body: { poiIds } }),
}

export const poiHref = (id: string) => `/map?poi=${encodeURIComponent(id)}`
