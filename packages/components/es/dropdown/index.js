import _sfc_main$1 from "./dropdown.vue.js";
import _sfc_main from "./dropdown-button.vue.js";
import { withInstall } from "../utils/install.js";
const DropdownButton = withInstall(_sfc_main, "ADropdownButton");
const Dropdown = withInstall(_sfc_main$1, "ADropdown");
Dropdown.Button = DropdownButton;
export {
  DropdownButton as ADropdownButton,
  DropdownButton,
  Dropdown as default
};
