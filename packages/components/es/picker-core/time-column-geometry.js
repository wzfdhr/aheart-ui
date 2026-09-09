const nearestPickerOption = (options, scrollTop, viewportHeight) => {
  if (!options.length)
    return void 0;
  const center = scrollTop + viewportHeight / 2;
  return options.reduce((nearest, option) => {
    const distance = Math.abs(option.top + option.height / 2 - center);
    const nearestDistance = Math.abs(nearest.top + nearest.height / 2 - center);
    return distance < nearestDistance ? option : nearest;
  }).value;
};
const measurePickerOptions = (column) => Array.from(column.querySelectorAll('[role="option"]')).map((element) => {
  const rect = element.getBoundingClientRect();
  const columnRect = column.getBoundingClientRect();
  return {
    value: element.dataset.hour ?? element.dataset.minute ?? element.dataset.second ?? element.dataset.period ?? "",
    top: rect.top - columnRect.top + column.scrollTop,
    height: rect.height
  };
}).filter((option) => option.height > 0);
const estimatePickerOptionHeight = (column) => {
  var _a;
  const first = column.querySelector('[role="option"]');
  const height = first ? Number.parseFloat(((_a = column.ownerDocument.defaultView) == null ? void 0 : _a.getComputedStyle(first).height) ?? "") : 0;
  return height > 0 ? height : 28;
};
export {
  estimatePickerOptionHeight,
  measurePickerOptions,
  nearestPickerOption
};
