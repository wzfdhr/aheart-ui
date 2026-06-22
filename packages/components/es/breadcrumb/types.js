const breadcrumbProps = {
  items: Array,
  params: {
    type: Object,
    default: () => ({})
  },
  separator: {
    type: [String, Number, Boolean, Object, Array],
    default: "/"
  },
  itemRender: Function,
  className: String,
  style: [String, Object, Array],
  classNames: {
    type: Object,
    default: () => ({})
  },
  styles: {
    type: Object,
    default: () => ({})
  }
};
export {
  breadcrumbProps
};
