import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { typographyProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATypography"
  },
  __name: "typography",
  props: typographyProps,
  setup(__props) {
    const props = __props;
    const semanticInfo = computed(() => ({ props }));
    const semanticClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const typographyClass = computed(() => [props.className, props.rootClassName, semanticClassNames.value.root]);
    const typographyStyle = computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("article", {
        class: normalizeClass(["aheart-typography", typographyClass.value]),
        style: normalizeStyle(typographyStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
