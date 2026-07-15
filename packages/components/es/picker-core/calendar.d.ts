import type { PickerDate } from './dayjs';
export interface PickerDateCell {
    value: PickerDate;
    inView: boolean;
    today: boolean;
}
export interface PickerDateConstraints {
    min?: PickerDate;
    max?: PickerDate;
    disabledDate?: (value: PickerDate) => boolean;
}
export declare const createDateMatrix: (view: PickerDate, weekStartsOn?: number, referenceDate?: PickerDate) => PickerDateCell[];
export declare const isPickerDateDisabled: (value: PickerDate, constraints?: PickerDateConstraints) => boolean;
