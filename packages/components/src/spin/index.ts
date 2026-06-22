import spin from './spin.vue'
import { withInstall } from '../utils/install'

const Spin = withInstall(spin, 'ASpin')

export default Spin
export type {
  SpinClassNames,
  SpinIndicator,
  SpinPercent,
  SpinProps,
  SpinRenderable,
  SpinSemanticPart,
  SpinStyles
} from './types'
