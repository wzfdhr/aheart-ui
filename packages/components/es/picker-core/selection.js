import { comparePickerValues } from "./codec.js";
const normalizeMultipleValues = (values) => [...new Set(values)];
const normalizeRangeValue = (value, format, order = true, allowEmpty = [false, false]) => {
  if (!value)
    return void 0;
  const [start, end] = value;
  if (!start && !allowEmpty[0] || !end && !allowEmpty[1])
    return void 0;
  if (order && start && end && comparePickerValues(start, end, format) > 0)
    return [end, start];
  return [start, end];
};
const updateRangeDraft = (value, nextValue, activePart) => {
  return activePart === "start" ? [nextValue, value == null ? void 0 : value[1]] : [value == null ? void 0 : value[0], nextValue];
};
const advanceRangeSelection = (value, nextValue, activePart, format, order = true, allowEmpty = [false, false]) => {
  if (activePart === "start") {
    return { value: [nextValue, void 0], activePart: "end", complete: false };
  }
  const candidate = [value == null ? void 0 : value[0], nextValue];
  const complete = Boolean((candidate[0] || allowEmpty[0]) && (candidate[1] || allowEmpty[1]));
  const normalized = complete ? normalizeRangeValue(candidate, format, order, allowEmpty) : candidate;
  return {
    value: normalized ?? candidate,
    activePart: "start",
    complete
  };
};
export {
  advanceRangeSelection,
  normalizeMultipleValues,
  normalizeRangeValue,
  updateRangeDraft
};
