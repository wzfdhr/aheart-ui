import Alert from "./alert/index.js";
import Badge from "./badge/index.js";
import Button from "./button/index.js";
import ConfigProvider from "./config-provider/index.js";
import Divider from "./divider/index.js";
import Empty from "./empty/index.js";
import Flex from "./flex/index.js";
import Icon from "./icon/index.js";
import Space from "./space/index.js";
import Spin from "./spin/index.js";
import Tag from "./tag/index.js";
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
  Empty
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
  Button,
  ConfigProvider,
  Divider,
  Empty,
  Flex,
  Icon,
  Link,
  Paragraph,
  Space,
  Spin,
  Tag,
  Text,
  Title,
  Typography,
  AheartUI as default
};
