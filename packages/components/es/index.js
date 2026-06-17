import Button from "./button/index.js";
import "./theme/index.css.js";
const components = [Button];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
export {
  Button,
  AheartUI as default
};
