import empty from './empty.vue'
import { withInstall, type SFCWithInstall } from '../utils/install'
import { EMPTY_PRESENTED_IMAGE_DEFAULT, EMPTY_PRESENTED_IMAGE_SIMPLE } from './types'

export const PRESENTED_IMAGE_DEFAULT = EMPTY_PRESENTED_IMAGE_DEFAULT
export const PRESENTED_IMAGE_SIMPLE = EMPTY_PRESENTED_IMAGE_SIMPLE

export type EmptyComponent = SFCWithInstall<typeof empty> & {
  PRESENTED_IMAGE_DEFAULT: typeof PRESENTED_IMAGE_DEFAULT
  PRESENTED_IMAGE_SIMPLE: typeof PRESENTED_IMAGE_SIMPLE
}

const Empty = withInstall(empty, 'AEmpty') as EmptyComponent

Empty.PRESENTED_IMAGE_DEFAULT = PRESENTED_IMAGE_DEFAULT
Empty.PRESENTED_IMAGE_SIMPLE = PRESENTED_IMAGE_SIMPLE

export default Empty
