import _sfc_main from "./empty.vue.js";
import { withInstall } from "../utils/install.js";
import { EMPTY_PRESENTED_IMAGE_DEFAULT, EMPTY_PRESENTED_IMAGE_SIMPLE } from "./types.js";
const PRESENTED_IMAGE_DEFAULT = EMPTY_PRESENTED_IMAGE_DEFAULT;
const PRESENTED_IMAGE_SIMPLE = EMPTY_PRESENTED_IMAGE_SIMPLE;
const Empty = withInstall(_sfc_main, "AEmpty");
Empty.PRESENTED_IMAGE_DEFAULT = PRESENTED_IMAGE_DEFAULT;
Empty.PRESENTED_IMAGE_SIMPLE = PRESENTED_IMAGE_SIMPLE;
export {
  PRESENTED_IMAGE_DEFAULT,
  PRESENTED_IMAGE_SIMPLE,
  Empty as default
};
