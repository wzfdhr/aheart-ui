import splitter from './splitter.vue'
import splitterPanel from './splitter-panel.vue'
import { withInstall } from '../utils/install'

const Splitter = withInstall(splitter, 'ASplitter')
const SplitterPanel = withInstall(splitterPanel, 'ASplitterPanel')

export { SplitterPanel }
export type { SplitterLayout, SplitterPanelConstraint, SplitterProps, SplitterSize } from './types'
export default Splitter
