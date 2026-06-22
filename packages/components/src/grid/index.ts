import type { App, Plugin } from 'vue'
import row from './row.vue'
import col from './col.vue'
import { withInstall } from '../utils/install'

const Row = withInstall(row, 'ARow')
const Col = withInstall(col, 'ACol')

const Grid: Plugin = {
  install(app: App) {
    app.use(Row)
    app.use(Col)
  }
}

export { Row, Col, Row as ARow, Col as ACol }
export type {
  ColProps,
  ColResponsiveConfig,
  ColSpanConfig,
  GridBreakpoint,
  GridGutter,
  GridResponsiveGutter,
  RowAlign,
  RowJustify,
  RowProps
} from './types'
export default Grid
