import dayjs from 'dayjs';
export type PickerDate = dayjs.Dayjs;
export declare const createPickerDate: (value?: string, format?: string, strict?: boolean) => PickerDate;
export declare const pickerDayjsLocale: (locale: 'zh-CN' | 'en-US') => "zh-cn" | "en";
