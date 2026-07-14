import type { App, Plugin } from 'vue'
import Alert from './alert'
import Badge, { BadgeRibbon } from './badge'
import Breadcrumb from './breadcrumb'
import Button from './button'
import Card, { CardGrid, CardMeta } from './card'
import Cascader from './cascader'
import Checkbox, { CheckboxGroup } from './checkbox'
import ConfigProvider from './config-provider'
import Descriptions from './descriptions'
import DatePicker from './date-picker'
import Divider from './divider'
import Drawer from './drawer'
import Dropdown, { DropdownButton } from './dropdown'
import Empty, { PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE } from './empty'
import Flex from './flex'
import Form, { FormItem } from './form'
import Grid, { Col, Row } from './grid'
import Icon from './icon'
import Input from './input'
import InputNumber from './input-number'
import Menu from './menu'
import Message, { message } from './message'
import Modal from './modal'
import Pagination from './pagination'
import Popconfirm from './popconfirm'
import Popover from './popover'
import Radio, { RadioGroup } from './radio'
import Select from './select'
import Skeleton from './skeleton'
import Space from './space'
import Spin from './spin'
import Steps from './steps'
import Switch from './switch'
import Splitter, { SplitterPanel } from './splitter'
import Table from './table'
import Tag, { CheckableTag, TagGroup } from './tag'
import Tabs from './tabs'
import TimePicker from './time-picker'
import Textarea from './textarea'
import Tree from './tree'
import TreeSelect from './tree-select'
import Tooltip from './tooltip'
import Typography, { Link, Paragraph, Text, Title } from './typography'
import Upload from './upload'
export type { AheartLocale } from './config'
export type { CascaderKey, CascaderOption, CascaderPath, CascaderValue } from './cascader'
export type { TreeKey, TreeNodeData } from './tree'
export type { UploadFile, UploadRequest, UploadRequestOption, UploadStatus } from './upload'
export type * from './checkbox'
export type * from './input-number'
export type * from './select'
export type * from './switch'
export type * from './textarea'
export type * from './time-picker'
export type * from './form'
export type * from './pagination'
export type * from './table'
export { enUS, zhCN } from './config'
import './theme/index.css'

const components = [
  Button,
  Cascader,
  ConfigProvider,
  Space,
  Divider,
  DatePicker,
  TimePicker,
  Upload,
  Tree,
  TreeSelect,
  Flex,
  Grid,
  Icon,
  Typography,
  Title,
  Text,
  Paragraph,
  Link,
  Tag,
  CheckableTag,
  TagGroup,
  Badge,
  BadgeRibbon,
  Alert,
  Message,
  Modal,
  Drawer,
  Tooltip,
  Popover,
  Popconfirm,
  Spin,
  Skeleton,
  Empty,
  Breadcrumb,
  Dropdown,
  DropdownButton,
  Menu,
  Tabs,
  Steps,
  Input,
  Textarea,
  InputNumber,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  Splitter,
  SplitterPanel,
  Card,
  CardGrid,
  CardMeta,
  Descriptions,
  Pagination,
  Select,
  Form,
  FormItem,
  Table
]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, Cascader, ConfigProvider, Space, Divider, DatePicker, TimePicker, Upload, Tree, TreeSelect, Flex, Grid, Row, Col, Icon, Typography, Title, Text, Paragraph, Link, Tag, CheckableTag, TagGroup, Badge, BadgeRibbon, Alert, Message, message, Modal, Drawer, Tooltip, Popover, Popconfirm, Spin, Skeleton, Empty, PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE, Breadcrumb, Dropdown, DropdownButton, DropdownButton as ADropdownButton, Menu, Tabs, Steps, Input, Textarea, InputNumber, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Splitter, SplitterPanel, Card, CardGrid, CardMeta, Descriptions, Pagination, Select, Form, FormItem, Table }
export default AheartUI
