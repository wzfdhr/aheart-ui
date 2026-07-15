import type { DefineComponent } from 'vue';
import type { DatePickerProps, DateRangePickerProps } from './types';
export * from './types';
type DatePickerComponent = DefineComponent<DatePickerProps, {
    focus: () => void;
    blur: () => void;
}>;
type DateRangePickerComponentType = DefineComponent<DateRangePickerProps, {
    focus: (part?: 'start' | 'end') => void;
    blur: () => void;
}>;
export declare const DateRangePicker: import("../utils/install").SFCWithInstall<DateRangePickerComponentType>;
declare const InstalledDatePicker: import("../utils/install").SFCWithInstall<DatePickerComponent> & {
    RangePicker: typeof DateRangePicker;
};
export default InstalledDatePicker;
