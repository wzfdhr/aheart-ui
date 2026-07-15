"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("@lucide/vue");
const iconComponents = {
  search: vue.Search,
  setting: vue.Settings,
  settings: vue.Settings,
  loading: vue.LoaderCircle,
  info: vue.Info,
  user: vue.User,
  plus: vue.Plus,
  check: vue.Check,
  close: vue.X,
  arrow: vue.ArrowRight,
  "arrow-left": vue.ArrowLeft,
  "arrow-right": vue.ArrowRight,
  "arrow-up": vue.ArrowUp,
  "arrow-down": vue.ArrowDown,
  "chevron-left": vue.ChevronLeft,
  "chevron-right": vue.ChevronRight,
  "chevron-up": vue.ChevronUp,
  "chevron-down": vue.ChevronDown,
  copy: vue.Copy,
  clock: vue.Clock,
  calendar: vue.CalendarDays,
  "chevrons-left": vue.ChevronsLeft,
  "chevrons-right": vue.ChevronsRight
};
const warnedUnknownIconNames = /* @__PURE__ */ new Set();
exports.iconComponents = iconComponents;
exports.warnedUnknownIconNames = warnedUnknownIconNames;
