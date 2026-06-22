"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const row_vue_vue_type_script_setup_true_lang = require("./row.vue.js");
const col_vue_vue_type_script_setup_true_lang = require("./col.vue.js");
const install = require("../utils/install.js");
const Row = install.withInstall(row_vue_vue_type_script_setup_true_lang.default, "ARow");
const Col = install.withInstall(col_vue_vue_type_script_setup_true_lang.default, "ACol");
const Grid = {
  install(app) {
    app.use(Row);
    app.use(Col);
  }
};
exports.ACol = Col;
exports.ARow = Row;
exports.Col = Col;
exports.Row = Row;
exports.default = Grid;
