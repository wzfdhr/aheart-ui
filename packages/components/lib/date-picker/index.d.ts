import type { DefineComponent } from 'vue';
import type { DatePickerProps } from './types';
export * from './types';
type DatePickerComponent = DefineComponent<DatePickerProps, {
    focus: () => void;
    blur: () => void;
}>;
declare const _default: import("../utils/install").SFCWithInstall<DatePickerComponent>;
export default _default;
