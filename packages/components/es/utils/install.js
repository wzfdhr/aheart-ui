const withInstall = (component, name) => {
  component.install = (app) => {
    app.component(name, component);
  };
  return component;
};
export {
  withInstall
};
