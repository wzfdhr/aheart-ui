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
    const configuredPlacement = toValue(options.placement) ?? "bottomLeft";
    const shouldAdjustOverflow = toValue(options.autoAdjustOverflow) !== false;
    const requestedPlacement = resolveViewportPlacement(
      reference,
      floating,
      configuredPlacement,
      shouldAdjustOverflow
    );
    const middleware = [offset(toValue(options.offset) ?? 8)];
    const alignOffset = toValue(options.alignOffset);
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
      middleware.push(flip());
    }
    if (toValue(options.shift) !== false) {
      middleware.push(shift({ padding: 8 }));
    }
    if (arrowElement) {
      middleware.push(arrow({ element: arrowElement, padding: 4 }));
    }
    const result = await computePosition(reference, floating, {
      placement: toFloatingUIPlacement(requestedPlacement),
      strategy: toValue(options.strategy) ?? "absolute",
      middleware
    });
    if (currentUpdateId !== updateId || toValue(options.open) === false || reference !== toValue(options.reference) || floating !== toValue(options.floating)) {
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
    const size = toValue(options.arrowSize) ?? 8;
    const nextArrowStyle = {
      ...arrowData.x === void 0 ? {} : { left: px(arrowData.x) },
      ...arrowData.y === void 0 ? {} : { top: px(arrowData.y) },
      [staticSide]: px(-size / 2)
    };
    if (!isSameStyle(arrowStyle.value, nextArrowStyle)) {
      arrowStyle.value = nextArrowStyle;
    }
  };
  watchEffect((onCleanup) => {
    const reference = toValue(options.reference);
    const floating = toValue(options.floating);
    const open = toValue(options.open) !== false;
    toValue(options.placement);
    toValue(options.strategy);
    toValue(options.offset);
    toValue(options.alignOffset);
    toValue(options.autoAdjustOverflow);
    toValue(options.shift);
    toValue(options.arrowSize);
    if (options.arrow)
      toValue(options.arrow);
    if (typeof window === "undefined" || !open || !reference || !floating) {
      return;
    }
    const cleanup = autoUpdate(
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
