import { Search, Settings, LoaderCircle, Info, User, Plus, Check, X, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Copy, Clock, CalendarDays, ChevronsLeft, ChevronsRight } from "@lucide/vue";
const iconComponents = {
  search: Search,
  setting: Settings,
  settings: Settings,
  loading: LoaderCircle,
  info: Info,
  user: User,
  plus: Plus,
  check: Check,
  close: X,
  arrow: ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  copy: Copy,
  clock: Clock,
  calendar: CalendarDays,
  "chevrons-left": ChevronsLeft,
  "chevrons-right": ChevronsRight
};
const warnedUnknownIconNames = /* @__PURE__ */ new Set();
export {
  iconComponents,
  warnedUnknownIconNames
};
