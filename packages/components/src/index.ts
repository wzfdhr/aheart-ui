import type { App, Plugin } from 'vue'
import Alert from './alert'
import Badge from './badge'
import Button from './button'
import ConfigProvider from './config-provider'
import Divider from './divider'
import Empty from './empty'
import Flex from './flex'
import Icon from './icon'
import Space from './space'
import Spin from './spin'
import Tag from './tag'
import Typography, { Link, Paragraph, Text, Title } from './typography'
import './theme/index.css'

const components = [
  Button,
  ConfigProvider,
  Space,
  Divider,
  Flex,
  Icon,
  Typography,
  Title,
  Text,
  Paragraph,
  Link,
  Tag,
  Badge,
  Alert,
  Spin,
  Empty
]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, ConfigProvider, Space, Divider, Flex, Icon, Typography, Title, Text, Paragraph, Link, Tag, Badge, Alert, Spin, Empty }
export default AheartUI
