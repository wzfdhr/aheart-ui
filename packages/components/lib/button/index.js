"use strict";
const button = require("./button.vue.js");
const withInstall = (comp) => {
  comp.install = (app) => {
    app.component(comp.name, comp);
  };
  return comp;
};
const Button = withInstall(button);
module.exports = Button;
