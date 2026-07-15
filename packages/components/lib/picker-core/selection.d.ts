import type { PickerFormat, RangePickerPart, RangePickerValue } from './types';
export declare const normalizeMultipleValues: (values: readonly string[]) => string[];
export declare const normalizeRangeValue: (value: RangePickerValue, format: PickerFormat, order?: boolean, allowEmpty?: [boolean, boolean]) => RangePickerValue;
export declare const updateRangeDraft: (value: RangePickerValue, nextValue: string, activePart: RangePickerPart) => Exclude<RangePickerValue, undefined>;
export interface RangeSelectionResult {
    value: Exclude<RangePickerValue, undefined>;
    activePart: RangePickerPart;
    complete: boolean;
}
export declare const advanceRangeSelection: (value: RangePickerValue, nextValue: string, activePart: RangePickerPart, format: PickerFormat, order?: boolean, allowEmpty?: [boolean, boolean]) => RangeSelectionResult;
