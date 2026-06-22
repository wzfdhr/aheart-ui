import badge from './badge.vue'
import ribbon from './ribbon.vue'
import { withInstall } from '../utils/install'

const Badge = withInstall(badge, 'ABadge')
export const BadgeRibbon = withInstall(ribbon, 'ABadgeRibbon')
const BadgeWithRibbon = Badge as typeof Badge & { Ribbon: typeof BadgeRibbon }

BadgeWithRibbon.Ribbon = BadgeRibbon

export { BadgeRibbon as ABadgeRibbon }
export type {
  BadgeClassNames,
  BadgeOffset,
  BadgeProps,
  BadgeRenderable,
  BadgeRibbonClassNames,
  BadgeRibbonPlacement,
  BadgeRibbonProps,
  BadgeRibbonSemanticPart,
  BadgeRibbonStyles,
  BadgeSemanticPart,
  BadgeSize,
  BadgeStatus,
  BadgeStyles
} from './types'
export default BadgeWithRibbon
