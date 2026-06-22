import Button from "./button/index.js";
import ConfigProvider from "./config-provider/index.js";
import Divider from "./divider/index.js";
import Flex from "./flex/index.js";
import Icon from "./icon/index.js";
import Space from "./space/index.js";
import Typography, { Title, Text, Paragraph, Link } from "./typography/index.js";
import "./theme/index.css.js";
const components = [Button, ConfigProvider, Space, Divider, Flex, Icon, Typography, Title, Text, Paragraph, Link];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
export {
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Icon,
  Link,
  Paragraph,
  Space,
  Text,
  Title,
  Typography,
  AheartUI as default
};
