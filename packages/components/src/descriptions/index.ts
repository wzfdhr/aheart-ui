import descriptions from './descriptions.vue'
import { withInstall } from '../utils/install'

const Descriptions = withInstall(descriptions, 'ADescriptions')

export default Descriptions
export type {
  DescriptionItem,
  DescriptionItemSpan,
  DescriptionRenderable,
  DescriptionsClassNames,
  DescriptionsLayout,
  DescriptionsProps,
  DescriptionsSemanticPart,
  DescriptionsStyles
} from './types'
