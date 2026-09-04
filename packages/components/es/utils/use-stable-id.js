import { useId, computed, toValue } from "vue";
const useStableId = (explicitId, prefix = "aheart") => {
  const generatedId = `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return computed(() => toValue(explicitId) ?? generatedId);
};
export {
  useStableId
};
