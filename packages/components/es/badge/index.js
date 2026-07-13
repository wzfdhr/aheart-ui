import _sfc_main from "./badge.vue.js";
import _sfc_main$1 from "./ribbon.vue.js";
import { withInstall } from "../utils/install.js";
const Badge = withInstall(_sfc_main, "ABadge");
const BadgeRibbon = withInstall(_sfc_main$1, "ABadgeRibbon");
const BadgeWithRibbon = Badge;
BadgeWithRibbon.Ribbon = BadgeRibbon;
const Badge$1 = BadgeWithRibbon;
export {
  BadgeRibbon as ABadgeRibbon,
  BadgeRibbon,
  Badge$1 as default
};
