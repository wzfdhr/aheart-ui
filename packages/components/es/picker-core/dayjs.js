import dayjs from "dayjs";
import "dayjs/locale/en.js";
import "dayjs/locale/zh-cn.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import quarterOfYear from "dayjs/plugin/quarterOfYear.js";
let configured = false;
const ensurePickerDayjs = () => {
  if (configured)
    return;
  dayjs.extend(advancedFormat);
  dayjs.extend(customParseFormat);
  dayjs.extend(isoWeek);
  dayjs.extend(quarterOfYear);
  configured = true;
};
const createPickerDate = (value, format, strict) => {
  ensurePickerDayjs();
  return format ? dayjs(value, format, strict) : dayjs(value);
};
export {
  createPickerDate
};
