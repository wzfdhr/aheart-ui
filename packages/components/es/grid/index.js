import _sfc_main from "./row.vue.js";
import _sfc_main$1 from "./col.vue.js";
import { withInstall } from "../utils/install.js";
const Row = withInstall(_sfc_main, "ARow");
const Col = withInstall(_sfc_main$1, "ACol");
const Grid = {
  install(app) {
    app.use(Row);
    app.use(Col);
  }
};
const Grid$1 = Grid;
export {
  Col as ACol,
  Row as ARow,
  Col,
  Row,
  Grid$1 as default
};
