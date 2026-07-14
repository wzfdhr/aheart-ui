"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const dom = require("@floating-ui/dom");
const vue = require("vue");
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
  const initialPlacement = vue.toValue(options.placement) ?? "bottomLeft";
  const placement = vue.ref(initialPlacement);
  const popupStyle = vue.ref({
    position: vue.toValue(options.strategy) ?? "absolute",
    left: "0px",
    top: "0px"
  });
  const arrowStyle = vue.ref({});
  const arrowStaticSide = vue.computed(() => getFloatingArrowStaticSide(placement.value));
  let updateId = 0;
  const update = async () => {
    const reference = vue.toValue(options.reference);
    const floating = vue.toValue(options.floating);
    if (typeof window === "undefined" || vue.toValue(options.open) === false || !reference || !floating) {
      return;
    }
    const currentUpdateId = ++updateId;
    const arrowElement = options.arrow ? vue.toValue(options.arrow) : void 0;
    const middleware = [dom.offset(vue.toValue(options.offset) ?? 8)];
    if (vue.toValue(options.autoAdjustOverflow) !== false) {
      middleware.push(dom.flip());
    }
    if (vue.toValue(options.shift) !== false) {
      middleware.push(dom.shift({ padding: 8 }));
    }
    if (arrowElement) {
      middleware.push(dom.arrow({ element: arrowElement, padding: 4 }));
    }
    const result = await dom.computePosition(reference, floating, {
      placement: toFloatingUIPlacement(vue.toValue(options.placement) ?? "bottomLeft"),
      strategy: vue.toValue(options.strategy) ?? "absolute",
      middleware
    });
    if (currentUpdateId !== updateId || vue.toValue(options.open) === false || reference !== vue.toValue(options.reference) || floating !== vue.toValue(options.floating)) {
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
    const size = vue.toValue(options.arrowSize) ?? 8;
    arrowStyle.value = {
      ...arrowData.x === void 0 ? {} : { left: px(arrowData.x) },
      ...arrowData.y === void 0 ? {} : { top: px(arrowData.y) },
      [staticSide]: px(-size / 2)
    };
  };
  vue.watchEffect((onCleanup) => {
    const reference = vue.toValue(options.reference);
    const floating = vue.toValue(options.floating);
    const open = vue.toValue(options.open) !== false;
    vue.toValue(options.placement);
    vue.toValue(options.strategy);
    vue.toValue(options.offset);
    vue.toValue(options.autoAdjustOverflow);
    vue.toValue(options.shift);
    vue.toValue(options.arrowSize);
    if (options.arrow)
      vue.toValue(options.arrow);
    if (typeof window === "undefined" || !open || !reference || !floating) {
      return;
    }
    const cleanup = dom.autoUpdate(reference, floating, update, options.autoUpdateOptions);
    onCleanup(() => {
      updateId += 1;
      cleanup();
    });
  });
  vue.onScopeDispose(() => {
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
exports.fromFloatingUIPlacement = fromFloatingUIPlacement;
exports.getFloatingArrowStaticSide = getFloatingArrowStaticSide;
exports.toFloatingUIPlacement = toFloatingUIPlacement;
exports.useFloatingPosition = useFloatingPosition;
