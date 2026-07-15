import type { DefineComponent } from 'vue';
import type { TimePickerProps, TimeRangePickerProps } from './types';
export * from './types';
type TimePickerComponent = DefineComponent<TimePickerProps, {
    focus: () => void;
    blur: () => void;
}>;
type TimeRangePickerComponentType = DefineComponent<TimeRangePickerProps, {
    focus: (part?: 'start' | 'end') => void;
    blur: () => void;
}>;
export declare const TimeRangePicker: import("../utils/install").SFCWithInstall<TimeRangePickerComponentType>;
declare const InstalledTimePicker: import("../utils/install").SFCWithInstall<TimePickerComponent> & {
    RangePicker: typeof TimeRangePicker;
};
export default InstalledTimePicker;
