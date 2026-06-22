import configProvider from './config-provider.vue'
import { withInstall } from '../utils/install'

const ConfigProvider = withInstall(configProvider, 'AConfigProvider')

export default ConfigProvider
