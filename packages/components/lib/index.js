"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$c = require("./alert/index.js");
const index$b = require("./badge/index.js");
const index$m = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$y = require("./card/index.js");
const index$u = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$z = require("./descriptions/index.js");
const index$4 = require("./date-picker/index.js");
const index$3 = require("./divider/index.js");
const index$f = require("./drawer/index.js");
const index$n = require("./dropdown/index.js");
const index$l = require("./empty/index.js");
const index$6 = require("./flex/index.js");
const index$C = require("./form/index.js");
const index$7 = require("./grid/index.js");
const index$8 = require("./icon/index.js");
const index$r = require("./input/index.js");
const index$t = require("./input-number/index.js");
const index$o = require("./menu/index.js");
const index$d = require("./message/index.js");
const index$e = require("./modal/index.js");
const index$A = require("./pagination/index.js");
const index$i = require("./popconfirm/index.js");
const index$h = require("./popover/index.js");
const index$v = require("./radio/index.js");
const index$B = require("./select/index.js");
const index$k = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$j = require("./spin/index.js");
const index$q = require("./steps/index.js");
const index$w = require("./switch/index.js");
const index$x = require("./splitter/index.js");
const index$D = require("./table/index.js");
const index$a = require("./tag/index.js");
const index$p = require("./tabs/index.js");
const index$5 = require("./time-picker/index.js");
const index$s = require("./textarea/index.js");
const index$g = require("./tooltip/index.js");
const index$9 = require("./typography/index.js");
require("./theme/index.css.js");
const service = require("./message/service.js");
const context = require("./config/context.js");
const components = [
  index.default,
  index$1.default,
  index$2.default,
  index$3.default,
  index$4.default,
  index$5.default,
  index$6.default,
  index$7.default,
  index$8.default,
  index$9.default,
  index$9.Title,
  index$9.Text,
  index$9.Paragraph,
  index$9.Link,
  index$a.default,
  index$a.CheckableTag,
  index$a.TagGroup,
  index$b.default,
  index$b.BadgeRibbon,
  index$c.default,
  index$d.default,
  index$e.default,
  index$f.default,
  index$g.default,
  index$h.default,
  index$i.default,
  index$j.default,
  index$k.default,
  index$l.default,
  index$m.default,
  index$n.default,
  index$n.DropdownButton,
  index$o.default,
  index$p.default,
  index$q.default,
  index$r.default,
  index$s.default,
  index$t.default,
  index$u.default,
  index$u.CheckboxGroup,
  index$v.default,
  index$v.RadioGroup,
  index$w.default,
  index$x.default,
  index$x.SplitterPanel,
  index$y.default,
  index$y.CardGrid,
  index$y.CardMeta,
  index$z.default,
  index$A.default,
  index$B.default,
  index$C.default,
  index$C.FormItem,
  index$D.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$c.default;
exports.Badge = index$b.default;
exports.BadgeRibbon = index$b.BadgeRibbon;
exports.Breadcrumb = index$m.default;
exports.Button = index.default;
exports.Card = index$y.default;
exports.CardGrid = index$y.CardGrid;
exports.CardMeta = index$y.CardMeta;
exports.Checkbox = index$u.default;
exports.CheckboxGroup = index$u.CheckboxGroup;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$z.default;
exports.DatePicker = index$4.default;
exports.Divider = index$3.default;
exports.Drawer = index$f.default;
exports.ADropdownButton = index$n.DropdownButton;
exports.Dropdown = index$n.default;
exports.DropdownButton = index$n.DropdownButton;
exports.Empty = index$l.default;
exports.PRESENTED_IMAGE_DEFAULT = index$l.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$l.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$6.default;
exports.Form = index$C.default;
exports.FormItem = index$C.FormItem;
exports.Col = index$7.Col;
exports.Grid = index$7.default;
exports.Row = index$7.Row;
exports.Icon = index$8.default;
exports.Input = index$r.default;
exports.InputNumber = index$t.default;
exports.Menu = index$o.default;
exports.Message = index$d.default;
exports.Modal = index$e.default;
exports.Pagination = index$A.default;
exports.Popconfirm = index$i.default;
exports.Popover = index$h.default;
exports.Radio = index$v.default;
exports.RadioGroup = index$v.RadioGroup;
exports.Select = index$B.default;
exports.Skeleton = index$k.default;
exports.Space = index$2.default;
exports.Spin = index$j.default;
exports.Steps = index$q.default;
exports.Switch = index$w.default;
exports.Splitter = index$x.default;
exports.SplitterPanel = index$x.SplitterPanel;
exports.Table = index$D.default;
exports.CheckableTag = index$a.CheckableTag;
exports.Tag = index$a.default;
exports.TagGroup = index$a.TagGroup;
exports.Tabs = index$p.default;
exports.TimePicker = index$5.default;
exports.Textarea = index$s.default;
exports.Tooltip = index$g.default;
exports.Link = index$9.Link;
exports.Paragraph = index$9.Paragraph;
exports.Text = index$9.Text;
exports.Title = index$9.Title;
exports.Typography = index$9.default;
exports.message = service.message;
exports.enUS = context.enUS;
exports.zhCN = context.zhCN;
exports.default = AheartUI;
