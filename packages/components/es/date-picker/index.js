import _sfc_main$1 from "./date-picker.vue.js";
import _sfc_main from "./date-range-picker.vue.js";
import { withInstall } from "../utils/install.js";
const DateRangePicker = withInstall(
  _sfc_main,
  "ADateRangePicker"
);
const InstalledDatePicker = withInstall(_sfc_main$1, "ADatePicker");
InstalledDatePicker.RangePicker = DateRangePicker;
const DatePicker = InstalledDatePicker;
export {
  DateRangePicker,
  DatePicker as default
};
