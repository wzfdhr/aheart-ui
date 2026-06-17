"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const withInstall = (component, name) => {
  component.install = (app) => {
    app.component(name, component);
  };
  return component;
};
exports.withInstall = withInstall;
