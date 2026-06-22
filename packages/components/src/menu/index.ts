import menu from './menu.vue'
import { withInstall } from '../utils/install'

const Menu = withInstall(menu, 'AMenu')

export default Menu
export type { MenuClickInfo, MenuItem, MenuMode, MenuProps, MenuSelectInfo, MenuTheme } from './types'
