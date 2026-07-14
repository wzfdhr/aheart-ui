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
const getPlacementSide = (placement) => {
  if (placement.startsWith("top"))
    return "top";
  if (placement.startsWith("bottom"))
    return "bottom";
  if (placement.startsWith("left"))
    return "left";
  return "right";
};
const getPlacementAlign = (placement) => {
  if (placement.endsWith("Left"))
    return "Left";
  if (placement.endsWith("Right"))
    return "Right";
  if (placement.endsWith("Top"))
    return "Top";
  if (placement.endsWith("Bottom"))
    return "Bottom";
  return "";
};
const resolveViewportPlacement = (reference, floating, requestedPlacement, enabled) => {
  if (!enabled || typeof window === "undefined")
    return requestedPlacement;
  const referenceRect = reference.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  let side = getPlacementSide(requestedPlacement);
  let align = getPlacementAlign(requestedPlacement);
  if (floatingRect.height > 0 && viewportHeight > 0) {
    const spaceAbove = referenceRect.top;
    const spaceBelow = viewportHeight - referenceRect.bottom;
    if (side === "top" && floatingRect.height > spaceAbove && spaceBelow > spaceAbove)
      side = "bottom";
    else if (side === "bottom" && floatingRect.height > spaceBelow && spaceAbove > spaceBelow)
      side = "top";
  }
  if (floatingRect.width > 0 && viewportWidth > 0) {
    const spaceLeft = referenceRect.left;
    const spaceRight = viewportWidth - referenceRect.right;
    if (side === "left" && floatingRect.width > spaceLeft && spaceRight > spaceLeft)
      side = "right";
    else if (side === "right" && floatingRect.width > spaceRight && spaceLeft > spaceRight)
      side = "left";
  }
  if ((side === "top" || side === "bottom") && floatingRect.width > 0 && viewportWidth > 0) {
    const leftAlignedRight = referenceRect.left + floatingRect.width;
    const rightAlignedLeft = referenceRect.right - floatingRect.width;
    const centerLeft = referenceRect.left + referenceRect.width / 2 - floatingRect.width / 2;
    const centerRight = centerLeft + floatingRect.width;
    if (align === "Left" && leftAlignedRight > viewportWidth && rightAlignedLeft >= 0)
      align = "Right";
    else if (align === "Right" && rightAlignedLeft < 0 && leftAlignedRight <= viewportWidth)
      align = "Left";
    else if (align === "" && centerLeft < 0 && leftAlignedRight <= viewportWidth)
      align = "Left";
    else if (align === "" && centerRight > viewportWidth && rightAlignedLeft >= 0)
      align = "Right";
  }
  if ((side === "left" || side === "right") && floatingRect.height > 0 && viewportHeight > 0) {
    const topAlignedBottom = referenceRect.top + floatingRect.height;
    const bottomAlignedTop = referenceRect.bottom - floatingRect.height;
    const centerTop = referenceRect.top + referenceRect.height / 2 - floatingRect.height / 2;
    const centerBottom = centerTop + floatingRect.height;
    if (align === "Top" && topAlignedBottom > viewportHeight && bottomAlignedTop >= 0)
      align = "Bottom";
    else if (align === "Bottom" && bottomAlignedTop < 0 && topAlignedBottom <= viewportHeight)
      align = "Top";
    else if (align === "" && centerTop < 0 && topAlignedBottom <= viewportHeight)
      align = "Top";
    else if (align === "" && centerBottom > viewportHeight && bottomAlignedTop >= 0)
      align = "Bottom";
  }
  return `${side}${align}`;
};
const isSameStyle = (current, next) => {
  const currentKeys = Object.keys(current);
  const nextKeys = Object.keys(next);
  return currentKeys.length === nextKeys.length && nextKeys.every(
    (key) => current[key] === next[key]
  );
};
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
    const configuredPlacement = vue.toValue(options.placement) ?? "bottomLeft";
    const shouldAdjustOverflow = vue.toValue(options.autoAdjustOverflow) !== false;
    const requestedPlacement = resolveViewportPlacement(
      reference,
      floating,
      configuredPlacement,
      shouldAdjustOverflow
    );
    const middleware = [dom.offset(vue.toValue(options.offset) ?? 8)];
    const alignOffset = vue.toValue(options.alignOffset);
    if (alignOffset) {
      const [rawX, rawY] = alignOffset;
      const xOffset = Number.isFinite(rawX) ? rawX : 0;
      const yOffset = Number.isFinite(rawY) ? rawY : 0;
      middleware.push({
        name: "aheartAlignOffset",
        fn: ({ x, y }) => ({ x: x + xOffset, y: y + yOffset })
      });
    }
    if (shouldAdjustOverflow && requestedPlacement === configuredPlacement) {
      middleware.push(dom.flip());
    }
    if (vue.toValue(options.shift) !== false) {
      middleware.push(dom.shift({ padding: 8 }));
    }
    if (arrowElement) {
      middleware.push(dom.arrow({ element: arrowElement, padding: 4 }));
    }
    const result = await dom.computePosition(reference, floating, {
      placement: toFloatingUIPlacement(requestedPlacement),
      strategy: vue.toValue(options.strategy) ?? "absolute",
      middleware
    });
    if (currentUpdateId !== updateId || vue.toValue(options.open) === false || reference !== vue.toValue(options.reference) || floating !== vue.toValue(options.floating)) {
      return;
    }
    const nextPlacement = fromFloatingUIPlacement(result.placement);
    const nextPopupStyle = {
      position: result.strategy,
      left: px(result.x),
      top: px(result.y)
    };
    if (placement.value !== nextPlacement) {
      placement.value = nextPlacement;
    }
    if (!isSameStyle(popupStyle.value, nextPopupStyle)) {
      popupStyle.value = nextPopupStyle;
    }
    const arrowData = result.middlewareData.arrow;
    if (!arrowElement || !arrowData) {
      if (Object.keys(arrowStyle.value).length > 0) {
        arrowStyle.value = {};
      }
      return;
    }
    const staticSide = getFloatingArrowStaticSide(placement.value);
    const size = vue.toValue(options.arrowSize) ?? 8;
    const nextArrowStyle = {
      ...arrowData.x === void 0 ? {} : { left: px(arrowData.x) },
      ...arrowData.y === void 0 ? {} : { top: px(arrowData.y) },
      [staticSide]: px(-size / 2)
    };
    if (!isSameStyle(arrowStyle.value, nextArrowStyle)) {
      arrowStyle.value = nextArrowStyle;
    }
  };
  vue.watchEffect((onCleanup) => {
    const reference = vue.toValue(options.reference);
    const floating = vue.toValue(options.floating);
    const open = vue.toValue(options.open) !== false;
    vue.toValue(options.placement);
    vue.toValue(options.strategy);
    vue.toValue(options.offset);
    vue.toValue(options.alignOffset);
    vue.toValue(options.autoAdjustOverflow);
    vue.toValue(options.shift);
    vue.toValue(options.arrowSize);
    if (options.arrow)
      vue.toValue(options.arrow);
    if (typeof window === "undefined" || !open || !reference || !floating) {
      return;
    }
    const cleanup = dom.autoUpdate(
      reference,
      floating,
      update,
      options.autoUpdateOptions
    );
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
