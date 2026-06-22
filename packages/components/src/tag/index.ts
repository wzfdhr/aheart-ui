import tag from './tag.vue'
import checkableTag from './checkable-tag.vue'
import tagGroup from './tag-group.vue'
import { withInstall } from '../utils/install'

const Tag = withInstall(tag, 'ATag')
export const CheckableTag = withInstall(checkableTag, 'ACheckableTag')
export const TagGroup = withInstall(tagGroup, 'ATagGroup')

export { CheckableTag as ACheckableTag, TagGroup as ATagGroup }
export type {
  CheckableTagProps,
  TagClassNames,
  TagColor,
  TagGroupClassNames,
  TagGroupProps,
  TagGroupSemanticPart,
  TagGroupStyles,
  TagGroupValue,
  TagIcon,
  TagOption,
  TagProps,
  TagRawOption,
  TagSemanticPart,
  TagStyles,
  TagValue,
  TagVariant
} from './types'
export default Tag
