"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$d = require("./alert/index.js");
const index$c = require("./badge/index.js");
const index$n = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$z = require("./card/index.js");
const index$v = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$A = require("./descriptions/index.js");
const index$4 = require("./date-picker/index.js");
const index$3 = require("./divider/index.js");
const index$g = require("./drawer/index.js");
const index$o = require("./dropdown/index.js");
const index$m = require("./empty/index.js");
const index$7 = require("./flex/index.js");
const index$D = require("./form/index.js");
const index$8 = require("./grid/index.js");
const index$9 = require("./icon/index.js");
const index$s = require("./input/index.js");
const index$u = require("./input-number/index.js");
const index$p = require("./menu/index.js");
const index$e = require("./message/index.js");
const index$f = require("./modal/index.js");
const index$B = require("./pagination/index.js");
const index$j = require("./popconfirm/index.js");
const index$i = require("./popover/index.js");
const index$w = require("./radio/index.js");
const index$C = require("./select/index.js");
const index$l = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$k = require("./spin/index.js");
const index$r = require("./steps/index.js");
const index$x = require("./switch/index.js");
const index$y = require("./splitter/index.js");
const index$E = require("./table/index.js");
const index$b = require("./tag/index.js");
const index$q = require("./tabs/index.js");
const index$5 = require("./time-picker/index.js");
const index$t = require("./textarea/index.js");
const index$h = require("./tooltip/index.js");
const index$a = require("./typography/index.js");
const index$6 = require("./upload/index.js");
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
  index$a.default,
  index$a.Title,
  index$a.Text,
  index$a.Paragraph,
  index$a.Link,
  index$b.default,
  index$b.CheckableTag,
  index$b.TagGroup,
  index$c.default,
  index$c.BadgeRibbon,
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
  index$C.default,
  index$D.default,
  index$D.FormItem,
  index$E.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$d.default;
exports.Badge = index$c.default;
exports.BadgeRibbon = index$c.BadgeRibbon;
exports.Breadcrumb = index$n.default;
exports.Button = index.default;
exports.Card = index$z.default;
exports.CardGrid = index$z.CardGrid;
exports.CardMeta = index$z.CardMeta;
exports.Checkbox = index$v.default;
exports.CheckboxGroup = index$v.CheckboxGroup;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$A.default;
exports.DatePicker = index$4.default;
exports.Divider = index$3.default;
exports.Drawer = index$g.default;
exports.ADropdownButton = index$o.DropdownButton;
exports.Dropdown = index$o.default;
exports.DropdownButton = index$o.DropdownButton;
exports.Empty = index$m.default;
exports.PRESENTED_IMAGE_DEFAULT = index$m.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$m.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$7.default;
exports.Form = index$D.default;
exports.FormItem = index$D.FormItem;
exports.Col = index$8.Col;
exports.Grid = index$8.default;
exports.Row = index$8.Row;
exports.Icon = index$9.default;
exports.Input = index$s.default;
exports.InputNumber = index$u.default;
exports.Menu = index$p.default;
exports.Message = index$e.default;
exports.Modal = index$f.default;
exports.Pagination = index$B.default;
exports.Popconfirm = index$j.default;
exports.Popover = index$i.default;
exports.Radio = index$w.default;
exports.RadioGroup = index$w.RadioGroup;
exports.Select = index$C.default;
exports.Skeleton = index$l.default;
exports.Space = index$2.default;
exports.Spin = index$k.default;
exports.Steps = index$r.default;
exports.Switch = index$x.default;
exports.Splitter = index$y.default;
exports.SplitterPanel = index$y.SplitterPanel;
exports.Table = index$E.default;
exports.CheckableTag = index$b.CheckableTag;
exports.Tag = index$b.default;
exports.TagGroup = index$b.TagGroup;
exports.Tabs = index$q.default;
exports.TimePicker = index$5.default;
exports.Textarea = index$t.default;
exports.Tooltip = index$h.default;
exports.Link = index$a.Link;
exports.Paragraph = index$a.Paragraph;
exports.Text = index$a.Text;
exports.Title = index$a.Title;
exports.Typography = index$a.default;
exports.Upload = index$6.default;
exports.message = service.message;
exports.enUS = context.enUS;
exports.zhCN = context.zhCN;
exports.default = AheartUI;
