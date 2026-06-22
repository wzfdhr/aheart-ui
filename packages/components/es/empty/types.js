const EMPTY_PRESENTED_IMAGE_DEFAULT = "__AHEART_EMPTY_PRESENTED_IMAGE_DEFAULT__";
const EMPTY_PRESENTED_IMAGE_SIMPLE = "__AHEART_EMPTY_PRESENTED_IMAGE_SIMPLE__";
const renderableProp = [String, Number, Boolean, Object, Array, Function];
const emptyProps = {
  description: {
    type: renderableProp,
    default: void 0
  },
  image: {
    type: renderableProp,
    default: void 0
  },
  imageStyle: [String, Object, Array],
  className: String,
  rootClassName: String,
  style: [String, Object, Array],
  classNames: Object,
  styles: Object
};
export {
  EMPTY_PRESENTED_IMAGE_DEFAULT,
  EMPTY_PRESENTED_IMAGE_SIMPLE,
  emptyProps
};
