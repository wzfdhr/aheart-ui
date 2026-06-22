import skeleton from './skeleton.vue'
import { withInstall } from '../utils/install'

const Skeleton = withInstall(skeleton, 'ASkeleton')

export default Skeleton
export type { SkeletonAvatarConfig, SkeletonAvatarShape, SkeletonParagraphConfig, SkeletonProps, SkeletonTitleConfig } from './types'
