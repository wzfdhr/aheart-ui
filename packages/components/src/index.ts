import type { App, Plugin } from 'vue'
import Button from './button'
import ConfigProvider from './config-provider'
import Divider from './divider'
import Flex from './flex'
import Icon from './icon'
import Space from './space'
import Typography, { Link, Paragraph, Text, Title } from './typography'
import './theme/index.css'

const components = [Button, ConfigProvider, Space, Divider, Flex, Icon, Typography, Title, Text, Paragraph, Link]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, ConfigProvider, Space, Divider, Flex, Icon, Typography, Title, Text, Paragraph, Link }
export default AheartUI
