import { getComponentEntries } from '../../build/package-entries.mjs'

// Public component entries and their transitive visual dependencies. Runtime imports
// and component CSS stay separate; legacy es/lib paths remain compatible.
export const componentEntries = getComponentEntries('base')

export const publicRuntimeExports = Object.fromEntries([
  ...componentEntries.map(({ subpath }) => [subpath, `${subpath}/index`]),
  ['full', 'full'],
  ['constant', 'constant/index'],
  ['resolver', 'resolver/index']
].map(([subpath, output]) => [`./${subpath}`, {
  types: `./es/${output}.d.ts`, import: `./es/${output}.js`, require: `./lib/${output}.js`
}]))
export const publicStyleExports = {
  './theme.css': './es/theme.css', './full.css': './es/full.css',
  ...Object.fromEntries(componentEntries.map(({ subpath }) => [`./${subpath}/style.css`, `./es/${subpath}/style.css`]))
}

export const fullStyleSources = [
    'theme/index.css',
    'button/style.css',
    'cascader/style.css',
    'config-provider/style.css',
    'space/style.css',
    'divider/style.css',
    'date-picker/style.css',
    'time-picker/style.css',
    'upload/style.css',
    'tree/style.css',
    'tree-select/style.css',
    'flex/style.css',
    'grid/style.css',
    'icon/style.css',
    'typography/style.css',
    'tag/style.css',
    'badge/style.css',
    'alert/style.css',
    'message/style.css',
    'modal/style.css',
    'drawer/style.css',
    'utils/floating.css',
    'combobox/style.css',
    'tooltip/style.css',
    'popover/style.css',
    'popconfirm/style.css',
    'spin/style.css',
    'skeleton/style.css',
    'empty/style.css',
    'breadcrumb/style.css',
    'dropdown/style.css',
    'menu/style.css',
    'tabs/style.css',
    'steps/style.css',
    'input/style.css',
    'textarea/style.css',
    'input-number/style.css',
    'checkbox/style.css',
    'radio/style.css',
    'switch/style.css',
    'splitter/style.css',
    'card/style.css',
    'descriptions/style.css',
    'pagination/style.css',
    'select/style.css',
    'form/style.css',
    'table/style.css'
]
