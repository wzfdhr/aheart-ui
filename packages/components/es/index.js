import Alert from "./alert/index.js";
import Badge from "./badge/index.js";
import Breadcrumb from "./breadcrumb/index.js";
import Button from "./button/index.js";
import Card from "./card/index.js";
import Checkbox from "./checkbox/index.js";
import ConfigProvider from "./config-provider/index.js";
import Descriptions from "./descriptions/index.js";
import Divider from "./divider/index.js";
import Empty from "./empty/index.js";
import Flex from "./flex/index.js";
import Icon from "./icon/index.js";
import Input from "./input/index.js";
import InputNumber from "./input-number/index.js";
import Pagination from "./pagination/index.js";
import Radio from "./radio/index.js";
import Space from "./space/index.js";
import Spin from "./spin/index.js";
import Steps from "./steps/index.js";
import Switch from "./switch/index.js";
import Tag from "./tag/index.js";
import Tabs from "./tabs/index.js";
import Textarea from "./textarea/index.js";
import Typography, { Title, Text, Paragraph, Link } from "./typography/index.js";
import "./theme/index.css.js";
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
  Switch,
  Card,
  Descriptions,
  Pagination
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
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Icon,
  Input,
  InputNumber,
  Link,
  Pagination,
  Paragraph,
  Radio,
  Space,
  Spin,
  Steps,
  Switch,
  Tabs,
  Tag,
  Text,
  Textarea,
  Title,
  Typography,
  AheartUI as default
};
