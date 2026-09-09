import { formatPickerValue, parsePickerValue } from "../picker-core/codec.js";
import { createPickerDate } from "../picker-core/dayjs.js";
const formatDate = (date, format) => formatPickerValue(
  createPickerDate(date.toISOString()),
  format
) ?? "";
const parseDate = (value, format) => {
  if (format !== "YYYY-MM-DD")
    return void 0;
  const parsed = parsePickerValue(value, format);
  if (!parsed || parsed.format(format) !== value)
    return void 0;
  return new Date(parsed.year(), parsed.month(), parsed.date());
};
const sameDate = (first, second) => first === second || Boolean(first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate());
export {
  formatDate,
  parseDate,
  sameDate
};
