import Alert from "./alert/index.js";
import BadgeWithRibbon, { BadgeRibbon } from "./badge/index.js";
import Breadcrumb from "./breadcrumb/index.js";
import Button from "./button/index.js";
import Card from "./card/index.js";
import Checkbox, { CheckboxGroup } from "./checkbox/index.js";
import ConfigProvider from "./config-provider/index.js";
import Descriptions from "./descriptions/index.js";
import Divider from "./divider/index.js";
import Drawer from "./drawer/index.js";
import Dropdown from "./dropdown/index.js";
import Empty from "./empty/index.js";
import { PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE } from "./empty/index.js";
import Flex from "./flex/index.js";
import Form, { FormItem } from "./form/index.js";
import Grid from "./grid/index.js";
import { Col, Row } from "./grid/index.js";
import Icon from "./icon/index.js";
import Input from "./input/index.js";
import InputNumber from "./input-number/index.js";
import Menu from "./menu/index.js";
import Message from "./message/index.js";
import Modal from "./modal/index.js";
import Pagination from "./pagination/index.js";
import Popconfirm from "./popconfirm/index.js";
import Popover from "./popover/index.js";
import Radio, { RadioGroup } from "./radio/index.js";
import Select from "./select/index.js";
import Skeleton from "./skeleton/index.js";
import Space from "./space/index.js";
import Spin from "./spin/index.js";
import Steps from "./steps/index.js";
import Switch from "./switch/index.js";
import Table from "./table/index.js";
import Tag, { CheckableTag, TagGroup } from "./tag/index.js";
import Tabs from "./tabs/index.js";
import Textarea from "./textarea/index.js";
import Tooltip from "./tooltip/index.js";
import Typography, { Title, Text, Paragraph, Link } from "./typography/index.js";
import "./theme/index.css.js";
import { message } from "./message/service.js";
const components = [
  Button,
  ConfigProvider,
  Space,
  Divider,
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
  BadgeWithRibbon,
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
  Card,
  Descriptions,
  Pagination,
  Select,
  Form,
  FormItem,
  Table
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
export {
  Alert,
  BadgeWithRibbon as Badge,
  BadgeRibbon,
  Breadcrumb,
  Button,
  Card,
  CheckableTag,
  Checkbox,
  CheckboxGroup,
  Col,
  ConfigProvider,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  Form,
  FormItem,
  Grid,
  Icon,
  Input,
  InputNumber,
  Link,
  Menu,
  Message,
  Modal,
  PRESENTED_IMAGE_DEFAULT,
  PRESENTED_IMAGE_SIMPLE,
  Pagination,
  Paragraph,
  Popconfirm,
  Popover,
  Radio,
  RadioGroup,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TagGroup,
  Text,
  Textarea,
  Title,
  Tooltip,
  Typography,
  AheartUI as default,
  message
};
