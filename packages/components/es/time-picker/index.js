import _sfc_main$1 from "./time-picker.vue.js";
import _sfc_main from "./time-range-picker.vue.js";
import { withInstall } from "../utils/install.js";
const TimeRangePicker = withInstall(_sfc_main, "ATimeRangePicker");
const InstalledTimePicker = withInstall(_sfc_main$1, "ATimePicker");
InstalledTimePicker.RangePicker = TimeRangePicker;
const TimePicker = InstalledTimePicker;
export {
  TimeRangePicker,
  TimePicker as default
};
