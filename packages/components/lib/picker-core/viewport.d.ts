export interface PickerViewportRect {
    top: number;
    bottom: number;
}
export declare const getPickerAvailableBlockSize: (trigger: PickerViewportRect, viewportHeight: number, placement: string, padding?: number) => number;
export declare const getPickerStableAvailableBlockSize: (trigger: PickerViewportRect, viewportHeight: number, padding?: number) => number;
