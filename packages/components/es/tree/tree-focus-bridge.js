const treeFocusBridgeKey = Symbol("aheart-tree-focus-bridge");
const treeVirtualViewportHeightKey = Symbol("aheart-tree-virtual-viewport-height");
const createTreeFocusBridge = () => {
  let requestImpl;
  let cancelImpl;
  let endpointsImpl;
  let pendingRequest;
  const dispatch = (key, options) => {
    if (requestImpl)
      requestImpl(key, options == null ? void 0 : options.allowExternalSource);
    else
      pendingRequest = { key, allowExternalSource: options == null ? void 0 : options.allowExternalSource };
  };
  return {
    register(request, cancel, endpoints) {
      requestImpl = request;
      cancelImpl = cancel;
      endpointsImpl = endpoints;
      if (pendingRequest) {
        const requestValue = pendingRequest;
        pendingRequest = void 0;
        request(requestValue.key, requestValue.allowExternalSource);
      }
      return () => {
        if (requestImpl === request) {
          requestImpl = void 0;
          cancelImpl = void 0;
          endpointsImpl = void 0;
        }
      };
    },
    request(key, options) {
      dispatch(key, options);
    },
    requestEndpoint(last, options) {
      const key = endpointsImpl == null ? void 0 : endpointsImpl(last);
      if (key !== void 0)
        dispatch(key, options);
    },
    cancel() {
      pendingRequest = void 0;
      cancelImpl == null ? void 0 : cancelImpl();
    }
  };
};
export {
  createTreeFocusBridge,
  treeFocusBridgeKey,
  treeVirtualViewportHeightKey
};
