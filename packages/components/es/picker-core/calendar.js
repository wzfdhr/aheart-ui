const createDateMatrix = (view, weekStartsOn = 0, referenceDate) => {
  const normalizedWeekStart = Math.trunc(Math.min(6, Math.max(0, weekStartsOn)));
  const monthStart = view.startOf("month");
  const leadingDays = (monthStart.day() - normalizedWeekStart + 7) % 7;
  const gridStart = monthStart.subtract(leadingDays, "day");
  const today = referenceDate == null ? void 0 : referenceDate.startOf("day");
  return Array.from({ length: 42 }, (_, index) => {
    const value = gridStart.add(index, "day");
    return {
      value,
      inView: value.month() === view.month(),
      today: Boolean(today && value.isSame(today, "day"))
    };
  });
};
const isPickerDateDisabled = (value, constraints = {}) => {
  var _a, _b, _c;
  const day = value.startOf("day");
  if (((_a = constraints.min) == null ? void 0 : _a.isValid()) && day.isBefore(constraints.min.startOf("day")))
    return true;
  if (((_b = constraints.max) == null ? void 0 : _b.isValid()) && day.isAfter(constraints.max.startOf("day")))
    return true;
  return ((_c = constraints.disabledDate) == null ? void 0 : _c.call(constraints, value)) ?? false;
};
export {
  createDateMatrix,
  isPickerDateDisabled
};
