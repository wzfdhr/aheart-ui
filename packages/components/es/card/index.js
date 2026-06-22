import _sfc_main$1 from "./card.vue.js";
import _sfc_main from "./meta.vue.js";
import { withInstall } from "../utils/install.js";
const CardMeta = withInstall(_sfc_main, "ACardMeta");
const Card = withInstall(_sfc_main$1, "ACard");
Card.Meta = CardMeta;
export {
  CardMeta as ACardMeta,
  CardMeta,
  Card as default
};
