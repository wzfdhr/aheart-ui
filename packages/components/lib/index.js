"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$g = require("./alert/index.js");
const index$f = require("./badge/index.js");
const index$p = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$B = require("./card/index.js");
const index$1 = require("./cascader/index.js");
const index$x = require("./checkbox/index.js");
const index$2 = require("./config-provider/index.js");
const index$C = require("./descriptions/index.js");
const index$5 = require("./date-picker/index.js");
const index$4 = require("./divider/index.js");
const index$i = require("./drawer/index.js");
const index$q = require("./dropdown/index.js");
const index$o = require("./empty/index.js");
const index$a = require("./flex/index.js");
const index$F = require("./form/index.js");
const index$b = require("./grid/index.js");
const index$c = require("./icon/index.js");
const index$u = require("./input/index.js");
const index$w = require("./input-number/index.js");
const index$r = require("./menu/index.js");
const _public = require("./message/public.js");
const index$h = require("./modal/index.js");
const index$D = require("./pagination/index.js");
const index$l = require("./popconfirm/index.js");
const index$k = require("./popover/index.js");
const index$y = require("./radio/index.js");
const index$E = require("./select/index.js");
const index$n = require("./skeleton/index.js");
const index$3 = require("./space/index.js");
const index$m = require("./spin/index.js");
const index$t = require("./steps/index.js");
const index$z = require("./switch/index.js");
const index$A = require("./splitter/index.js");
const index$G = require("./table/index.js");
const index$e = require("./tag/index.js");
const index$s = require("./tabs/index.js");
const index$6 = require("./time-picker/index.js");
const index$v = require("./textarea/index.js");
const index$8 = require("./tree/index.js");
const index$9 = require("./tree-select/index.js");
const index$j = require("./tooltip/index.js");
const index$d = require("./typography/index.js");
const index$7 = require("./upload/index.js");
const floatingCore = require("./utils/floating-core.js");
require("./theme/index.css.js");
const service = require("./message/service.js");
const context = require("./config/context.js");
const useFloatingPosition = require("./utils/use-floating-position.js");
const components = [
  index.default,
  index$1.default,
  index$2.default,
  index$3.default,
  index$4.default,
  index$5.default,
  index$5.DateRangePicker,
  index$6.default,
  index$6.TimeRangePicker,
  index$7.default,
  index$8.default,
  index$9.default,
  index$a.default,
  index$b.default,
  index$c.default,
  index$d.default,
  index$d.Title,
  index$d.Text,
  index$d.Paragraph,
  index$d.Link,
  index$e.default,
  index$e.CheckableTag,
  index$e.TagGroup,
  index$f.default,
  index$f.BadgeRibbon,
  index$g.default,
  _public.default,
  index$h.default,
  index$i.default,
  index$j.default,
  index$k.default,
  index$l.default,
  index$m.default,
  index$n.default,
  index$o.default,
  index$p.default,
  index$q.default,
  index$q.DropdownButton,
  index$r.default,
  index$s.default,
  index$t.default,
  index$u.default,
  index$v.default,
  index$w.default,
  index$x.default,
  index$x.CheckboxGroup,
  index$y.default,
  index$y.RadioGroup,
  index$z.default,
  index$A.default,
  index$A.SplitterPanel,
  index$B.default,
  index$B.CardGrid,
  index$B.CardMeta,
  index$C.default,
  index$D.default,
  index$E.default,
  index$F.default,
  index$F.FormItem,
  index$G.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$g.default;
exports.Badge = index$f.default;
exports.BadgeRibbon = index$f.BadgeRibbon;
exports.Breadcrumb = index$p.default;
exports.Button = index.default;
exports.Card = index$B.default;
exports.CardGrid = index$B.CardGrid;
exports.CardMeta = index$B.CardMeta;
exports.Cascader = index$1.default;
exports.Checkbox = index$x.default;
exports.CheckboxGroup = index$x.CheckboxGroup;
exports.ConfigProvider = index$2.default;
exports.Descriptions = index$C.default;
exports.DatePicker = index$5.default;
exports.DateRangePicker = index$5.DateRangePicker;
exports.Divider = index$4.default;
exports.Drawer = index$i.default;
exports.ADropdownButton = index$q.DropdownButton;
exports.Dropdown = index$q.default;
exports.DropdownButton = index$q.DropdownButton;
exports.Empty = index$o.default;
exports.PRESENTED_IMAGE_DEFAULT = index$o.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$o.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$a.default;
exports.Form = index$F.default;
exports.FormItem = index$F.FormItem;
exports.Col = index$b.Col;
exports.Grid = index$b.default;
exports.Row = index$b.Row;
exports.Icon = index$c.default;
exports.Input = index$u.default;
exports.InputNumber = index$w.default;
exports.Menu = index$r.default;
exports.Message = _public.default;
exports.Modal = index$h.default;
exports.Pagination = index$D.default;
exports.Popconfirm = index$l.default;
exports.Popover = index$k.default;
exports.Radio = index$y.default;
exports.RadioGroup = index$y.RadioGroup;
exports.Select = index$E.default;
exports.Skeleton = index$n.default;
exports.Space = index$3.default;
exports.Spin = index$m.default;
exports.Steps = index$t.default;
exports.Switch = index$z.default;
exports.Splitter = index$A.default;
exports.SplitterPanel = index$A.SplitterPanel;
exports.Table = index$G.default;
exports.CheckableTag = index$e.CheckableTag;
exports.Tag = index$e.default;
exports.TagGroup = index$e.TagGroup;
exports.Tabs = index$s.default;
exports.TimePicker = index$6.default;
exports.TimeRangePicker = index$6.TimeRangePicker;
exports.Textarea = index$v.default;
exports.Tree = index$8.default;
exports.TreeSelect = index$9.default;
exports.Tooltip = index$j.default;
exports.Link = index$d.Link;
exports.Paragraph = index$d.Paragraph;
exports.Text = index$d.Text;
exports.Title = index$d.Title;
exports.Typography = index$d.default;
exports.Upload = index$7.default;
exports.floatingPlacements = floatingCore.floatingPlacements;
exports.floatingTriggers = floatingCore.floatingTriggers;
exports.getFloatingPopupStyle = floatingCore.getFloatingPopupStyle;
exports.isFloatingPlacement = floatingCore.isFloatingPlacement;
exports.isFloatingTrigger = floatingCore.isFloatingTrigger;
exports.isFloatingTriggerProp = floatingCore.isFloatingTriggerProp;
exports.normalizeFloatingTriggers = floatingCore.normalizeFloatingTriggers;
exports.message = service.message;
exports.enUS = context.enUS;
exports.zhCN = context.zhCN;
exports.fromFloatingUIPlacement = useFloatingPosition.fromFloatingUIPlacement;
exports.getFloatingArrowStaticSide = useFloatingPosition.getFloatingArrowStaticSide;
exports.toFloatingUIPlacement = useFloatingPosition.toFloatingUIPlacement;
exports.useFloatingPosition = useFloatingPosition.useFloatingPosition;
exports.default = AheartUI;
