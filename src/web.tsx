import type { WebPlugin } from '@outflow/sdk/web'
import { Suspense, lazy } from 'react'
import { DocPois } from './DocPois'
import './map.css'

// 地图页体积较大，按需加载
const MapPage = lazy(() => import('./MapPage'))

const plugin: WebPlugin = {
  pages: [
    {
      path: '/map',
      fullscreen: true,
      component: () => (
        <Suspense fallback={null}>
          <MapPage />
        </Suspense>
      ),
    },
  ],
  docPanel: DocPois,
}

export default plugin
