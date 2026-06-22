import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { rowProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ARow"
  },
  __name: "row",
  props: rowProps,
  setup(__props) {
    const props = __props;
    const breakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
    const normalizeGutter = (gutter) => {
      if (typeof gutter === "number") {
        return {
          base: gutter,
          responsive: {}
        };
      }
      return {
        base: (gutter == null ? void 0 : gutter.xs) ?? (gutter == null ? void 0 : gutter.sm) ?? (gutter == null ? void 0 : gutter.md) ?? (gutter == null ? void 0 : gutter.lg) ?? (gutter == null ? void 0 : gutter.xl) ?? (gutter == null ? void 0 : gutter.xxl) ?? 0,
        responsive: gutter ?? {}
      };
    };
    const horizontalGutter = computed(() => {
      return Array.isArray(props.gutter) ? normalizeGutter(props.gutter[0]) : normalizeGutter(props.gutter);
    });
    const verticalGutter = computed(() => {
      return Array.isArray(props.gutter) ? normalizeGutter(props.gutter[1]) : normalizeGutter(0);
    });
    const rowClass = computed(() => [
      {
        [`aheart-row--justify-${props.justify}`]: props.justify,
        [`aheart-row--align-${props.align}`]: props.align,
        "is-nowrap": !props.wrap
      }
    ]);
    const rowStyle = computed(() => {
      const style = {
        "--aheart-row-gutter-horizontal": `${horizontalGutter.value.base}px`,
        "--aheart-row-gutter-vertical": `${verticalGutter.value.base}px`
      };
      breakpoints.forEach((breakpoint) => {
        const horizontal = horizontalGutter.value.responsive[breakpoint];
        const vertical = verticalGutter.value.responsive[breakpoint];
        if (horizontal !== void 0) {
          style[`--aheart-row-${breakpoint}-gutter-horizontal`] = `${horizontal}px`;
        }
        if (vertical !== void 0) {
          style[`--aheart-row-${breakpoint}-gutter-vertical`] = `${vertical}px`;
        }
      });
      return style;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-row", rowClass.value]),
        style: normalizeStyle(rowStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
