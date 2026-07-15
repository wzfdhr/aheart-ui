export interface PickerTimeParts {
    hour: number;
    minute: number;
    second: number;
}
export interface PickerMeridiemLabels {
    am: string;
    pm: string;
}
export declare const parseTimeValue: (value?: string, labels?: PickerMeridiemLabels) => PickerTimeParts | undefined;
export declare const formatTimeValue: (parts: PickerTimeParts, format: string, labels?: PickerMeridiemLabels) => string;
export declare const createTimeOptions: (limit: number, step: number, start?: number) => number[];
export declare const timePartsToSeconds: (parts: PickerTimeParts) => number;
