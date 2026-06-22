import tooltip from './tooltip.vue'
import { withInstall } from '../utils/install'

const Tooltip = withInstall(tooltip, 'ATooltip')

export default Tooltip
export type { TooltipProps } from './types'
