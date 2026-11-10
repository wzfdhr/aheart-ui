"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$f = require("./alert/index.js");
const index$e = require("./badge/index.js");
const index$n = require("./breadcrumb/index.js");
const button_index = require("./button/index.js");
const index$z = require("./card/index.js");
const index = require("./cascader/index.js");
const index$v = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$A = require("./descriptions/index.js");
const index$4 = require("./date-picker/index.js");
const index$3 = require("./divider/index.js");
const index$g = require("./drawer/index.js");
const index$o = require("./dropdown/index.js");
const index$m = require("./empty/index.js");
const index$9 = require("./flex/index.js");
const index$C = require("./form/index.js");
const index$a = require("./grid/index.js");
const index$b = require("./icon/index.js");
const index$s = require("./input/index.js");
const index$u = require("./input-number/index.js");
const index$p = require("./menu/index.js");
const _public = require("./message/public.js");
const modal_index = require("./modal/index.js");
const index$B = require("./pagination/index.js");
const index$j = require("./popconfirm/index.js");
const index$i = require("./popover/index.js");
const index$w = require("./radio/index.js");
const select_index = require("./select/index.js");
const index$l = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$k = require("./spin/index.js");
const index$r = require("./steps/index.js");
const index$x = require("./switch/index.js");
const index$y = require("./splitter/index.js");
const index$D = require("./table/index.js");
const index$d = require("./tag/index.js");
const index$q = require("./tabs/index.js");
const index$5 = require("./time-picker/index.js");
const index$t = require("./textarea/index.js");
const index$7 = require("./tree/index.js");
const index$8 = require("./tree-select/index.js");
const index$h = require("./tooltip/index.js");
const index$c = require("./typography/index.js");
const index$6 = require("./upload/index.js");
const components = [
  button_index.default,
  index.default,
  index$1.default,
  index$2.default,
  index$3.default,
  index$4.default,
  index$4.DateRangePicker,
  index$5.default,
  index$5.TimeRangePicker,
  index$6.default,
  index$7.default,
  index$8.default,
  index$9.default,
  index$a.default,
  index$b.default,
  index$c.default,
  index$c.Title,
  index$c.Text,
  index$c.Paragraph,
  index$c.Link,
  index$d.default,
  index$d.CheckableTag,
  index$d.TagGroup,
  index$e.default,
  index$e.BadgeRibbon,
  index$f.default,
  _public.default,
  modal_index.default,
  index$g.default,
  index$h.default,
  index$i.default,
  index$j.default,
  index$k.default,
  index$l.default,
  index$m.default,
  index$n.default,
  index$o.default,
  index$o.DropdownButton,
  index$p.default,
  index$q.default,
  index$r.default,
  index$s.default,
  index$t.default,
  index$u.default,
  index$v.default,
  index$v.CheckboxGroup,
  index$w.default,
  index$w.RadioGroup,
  index$x.default,
  index$y.default,
  index$y.SplitterPanel,
  index$z.default,
  index$z.CardGrid,
  index$z.CardMeta,
  index$A.default,
  index$B.default,
  select_index.default,
  index$C.default,
  index$C.FormItem,
  index$C.FormList,
  index$D.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => app.use(component));
  }
};
const AheartUI$1 = AheartUI;
exports.Alert = index$f.default;
exports.Badge = index$e.default;
exports.BadgeRibbon = index$e.BadgeRibbon;
exports.Breadcrumb = index$n.default;
exports.Button = button_index.default;
exports.Card = index$z.default;
exports.CardGrid = index$z.CardGrid;
exports.CardMeta = index$z.CardMeta;
exports.Cascader = index.default;
exports.Checkbox = index$v.default;
exports.CheckboxGroup = index$v.CheckboxGroup;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$A.default;
exports.DatePicker = index$4.default;
exports.DateRangePicker = index$4.DateRangePicker;
exports.Divider = index$3.default;
exports.Drawer = index$g.default;
exports.ADropdownButton = index$o.DropdownButton;
exports.Dropdown = index$o.default;
exports.DropdownButton = index$o.DropdownButton;
exports.Empty = index$m.default;
exports.PRESENTED_IMAGE_DEFAULT = index$m.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$m.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$9.default;
exports.AFormItem = index$C.FormItem;
exports.AFormList = index$C.FormList;
exports.Form = index$C.default;
exports.FormItem = index$C.FormItem;
exports.FormList = index$C.FormList;
exports.Col = index$a.Col;
exports.Grid = index$a.default;
exports.Row = index$a.Row;
exports.Icon = index$b.default;
exports.Input = index$s.default;
exports.InputNumber = index$u.default;
exports.Menu = index$p.default;
exports.Message = _public.default;
exports.Modal = modal_index.default;
exports.Pagination = index$B.default;
exports.Popconfirm = index$j.default;
exports.Popover = index$i.default;
exports.Radio = index$w.default;
exports.RadioGroup = index$w.RadioGroup;
exports.Select = select_index.default;
exports.Skeleton = index$l.default;
exports.Space = index$2.default;
exports.Spin = index$k.default;
exports.Steps = index$r.default;
exports.Switch = index$x.default;
exports.Splitter = index$y.default;
exports.SplitterPanel = index$y.SplitterPanel;
exports.Table = index$D.default;
exports.CheckableTag = index$d.CheckableTag;
exports.Tag = index$d.default;
exports.TagGroup = index$d.TagGroup;
exports.Tabs = index$q.default;
exports.TimePicker = index$5.default;
exports.TimeRangePicker = index$5.TimeRangePicker;
exports.Textarea = index$t.default;
exports.Tree = index$7.default;
exports.TreeSelect = index$8.default;
exports.Tooltip = index$h.default;
exports.Link = index$c.Link;
exports.Paragraph = index$c.Paragraph;
exports.Text = index$c.Text;
exports.Title = index$c.Title;
exports.Typography = index$c.default;
exports.Upload = index$6.default;
exports.AheartUI = AheartUI;
exports.default = AheartUI$1;
