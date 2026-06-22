import type { App, Plugin } from 'vue'
import Alert from './alert'
import Badge from './badge'
import Breadcrumb from './breadcrumb'
import Button from './button'
import Checkbox from './checkbox'
import ConfigProvider from './config-provider'
import Divider from './divider'
import Empty from './empty'
import Flex from './flex'
import Icon from './icon'
import Input from './input'
import InputNumber from './input-number'
import Radio from './radio'
import Space from './space'
import Spin from './spin'
import Steps from './steps'
import Switch from './switch'
import Tag from './tag'
import Tabs from './tabs'
import Textarea from './textarea'
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
  Empty,
  Breadcrumb,
  Tabs,
  Steps,
  Input,
  Textarea,
  InputNumber,
  Checkbox,
  Radio,
  Switch
]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, ConfigProvider, Space, Divider, Flex, Icon, Typography, Title, Text, Paragraph, Link, Tag, Badge, Alert, Spin, Empty, Breadcrumb, Tabs, Steps, Input, Textarea, InputNumber, Checkbox, Radio, Switch }
export default AheartUI
