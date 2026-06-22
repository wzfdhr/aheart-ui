import Button from "./button/index.js";
import ConfigProvider from "./config-provider/index.js";
import "./theme/index.css.js";
const components = [Button, ConfigProvider];
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
  AheartUI as default
};
