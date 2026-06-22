const skeletonProps = {
  loading: {
    type: Boolean,
    default: true
  },
  active: Boolean,
  avatar: [Boolean, Object],
  title: {
    type: [Boolean, Object],
    default: true
  },
  paragraph: {
    type: [Boolean, Object],
    default: true
  },
  round: Boolean
};
export {
  skeletonProps
};
