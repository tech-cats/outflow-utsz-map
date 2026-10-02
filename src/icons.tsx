// 内联图标（线条风格，参考 Lucide，ISC 许可）。插件不能有自己的 npm 依赖，因此不使用图标库。
import type { ReactNode } from 'react'

function Icon({ size = 18, children, strokeWidth = 2 }: { size?: number; children: ReactNode; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

type P = { size?: number; strokeWidth?: number }

export const IconX = (p: P) => <Icon {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>
export const IconPlus = (p: P) => <Icon {...p}><path d="M5 12h14" /><path d="M12 5v14" /></Icon>
export const IconMinus = (p: P) => <Icon {...p}><path d="M5 12h14" /></Icon>
export const IconSearch = (p: P) => <Icon {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
export const IconMenu = (p: P) => <Icon {...p}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></Icon>
export const IconChevronLeft = (p: P) => <Icon {...p}><path d="m15 18-6-6 6-6" /></Icon>
export const IconChevronRight = (p: P) => <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>
export const IconPin = (p: P) => (
  <Icon {...p}>
    <path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
)
export const IconDoor = (p: P) => (
  <Icon {...p}>
    <path d="M13 4h3a2 2 0 0 1 2 2v14" />
    <path d="M2 20h3" />
    <path d="M13 20h9" />
    <path d="M10 12v.01" />
    <path d="M13 4.56v16.16a1 1 0 0 1-1.24.97L5 20V5.56a2 2 0 0 1 1.52-1.94l4-1A2 2 0 0 1 13 4.56Z" />
  </Icon>
)
export const IconLandmark = (p: P) => (
  <Icon {...p}>
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
    <path d="M10 18v-7" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M12 2 20 7H4z" />
  </Icon>
)
export const IconCameraOff = (p: P) => (
  <Icon {...p}>
    <path d="m2 2 20 20" />
    <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16" />
    <path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5" />
    <path d="M14.12 15.12A3 3 0 1 1 9.88 10.88" />
  </Icon>
)
export const IconPencil = (p: P) => (
  <Icon {...p}>
    <path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
  </Icon>
)
export const IconCrosshair = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M22 12h-4" />
    <path d="M6 12H2" />
    <path d="M12 6V2" />
    <path d="M12 22v-4" />
  </Icon>
)
