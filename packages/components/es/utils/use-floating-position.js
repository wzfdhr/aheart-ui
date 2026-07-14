import { autoUpdate, offset, flip, shift, arrow, computePosition } from "@floating-ui/dom";
import { toValue, ref, computed, watchEffect, onScopeDispose } from "vue";
const placementToFloatingUI = {
  top: "top",
  topLeft: "top-start",
  topRight: "top-end",
  bottom: "bottom",
  bottomLeft: "bottom-start",
  bottomRight: "bottom-end",
  left: "left",
  leftTop: "left-start",
  leftBottom: "left-end",
  right: "right",
  rightTop: "right-start",
  rightBottom: "right-end"
};
const placementFromFloatingUI = Object.fromEntries(
  Object.entries(placementToFloatingUI).map(([aheartPlacement, floatingPlacement]) => [
    floatingPlacement,
    aheartPlacement
  ])
);
const oppositeSide = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
const toFloatingUIPlacement = (placement) => placementToFloatingUI[placement];
const fromFloatingUIPlacement = (placement) => placementFromFloatingUI[placement];
const getFloatingArrowStaticSide = (placement) => oppositeSide[toFloatingUIPlacement(placement).split("-")[0]];
const px = (value) => `${Math.round(value * 100) / 100}px`;
function useFloatingPosition(options) {
  const initialPlacement = toValue(options.placement) ?? "bottomLeft";
  const placement = ref(initialPlacement);
  const popupStyle = ref({
    position: toValue(options.strategy) ?? "absolute",
    left: "0px",
    top: "0px"
  });
  const arrowStyle = ref({});
  const arrowStaticSide = computed(() => getFloatingArrowStaticSide(placement.value));
  let updateId = 0;
  const update = async () => {
    const reference = toValue(options.reference);
    const floating = toValue(options.floating);
    if (typeof window === "undefined" || toValue(options.open) === false || !reference || !floating) {
      return;
    }
    const currentUpdateId = ++updateId;
    const arrowElement = options.arrow ? toValue(options.arrow) : void 0;
    const middleware = [offset(toValue(options.offset) ?? 8)];
    if (toValue(options.autoAdjustOverflow) !== false) {
      middleware.push(flip());
    }
    if (toValue(options.shift) !== false) {
      middleware.push(shift({ padding: 8 }));
    }
    if (arrowElement) {
      middleware.push(arrow({ element: arrowElement, padding: 4 }));
    }
    const result = await computePosition(reference, floating, {
      placement: toFloatingUIPlacement(toValue(options.placement) ?? "bottomLeft"),
      strategy: toValue(options.strategy) ?? "absolute",
      middleware
    });
    if (currentUpdateId !== updateId || toValue(options.open) === false || reference !== toValue(options.reference) || floating !== toValue(options.floating)) {
      return;
    }
    placement.value = fromFloatingUIPlacement(result.placement);
    popupStyle.value = {
      position: result.strategy,
      left: px(result.x),
      top: px(result.y)
    };
    const arrowData = result.middlewareData.arrow;
    if (!arrowElement || !arrowData) {
      arrowStyle.value = {};
      return;
    }
    const staticSide = getFloatingArrowStaticSide(placement.value);
    const size = toValue(options.arrowSize) ?? 8;
    arrowStyle.value = {
      ...arrowData.x === void 0 ? {} : { left: px(arrowData.x) },
      ...arrowData.y === void 0 ? {} : { top: px(arrowData.y) },
      [staticSide]: px(-size / 2)
    };
  };
  watchEffect((onCleanup) => {
    const reference = toValue(options.reference);
    const floating = toValue(options.floating);
    const open = toValue(options.open) !== false;
    toValue(options.placement);
    toValue(options.strategy);
    toValue(options.offset);
    toValue(options.autoAdjustOverflow);
    toValue(options.shift);
    toValue(options.arrowSize);
    if (options.arrow)
      toValue(options.arrow);
    if (typeof window === "undefined" || !open || !reference || !floating) {
      return;
    }
    const cleanup = autoUpdate(reference, floating, update, options.autoUpdateOptions);
    onCleanup(() => {
      updateId += 1;
      cleanup();
    });
  });
  onScopeDispose(() => {
    updateId += 1;
  });
  return {
    placement,
    popupStyle,
    arrowStyle,
    arrowStaticSide,
    update
  };
}
export {
  fromFloatingUIPlacement,
  getFloatingArrowStaticSide,
  toFloatingUIPlacement,
  useFloatingPosition
};
