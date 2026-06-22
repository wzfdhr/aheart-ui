import drawer from './drawer.vue'
import { withInstall } from '../utils/install'

const Drawer = withInstall(drawer, 'ADrawer')

export default Drawer
export type { DrawerPlacement, DrawerProps } from './types'
