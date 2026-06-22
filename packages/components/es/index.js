import Button from "./button/index.js";
import ConfigProvider from "./config-provider/index.js";
import Divider from "./divider/index.js";
import Flex from "./flex/index.js";
import Space from "./space/index.js";
import "./theme/index.css.js";
const components = [Button, ConfigProvider, Space, Divider, Flex];
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
  Space,
  AheartUI as default
};
