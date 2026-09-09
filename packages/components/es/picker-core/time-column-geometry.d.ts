export interface PickerOptionGeometry {
    value: number | string;
    top: number;
    height: number;
}
export declare const nearestPickerOption: <T extends PickerOptionGeometry>(options: T[], scrollTop: number, viewportHeight: number) => string | number | undefined;
export declare const measurePickerOptions: (column: HTMLElement) => {
    value: string;
    top: number;
    height: number;
}[];
export declare const estimatePickerOptionHeight: (column: HTMLElement) => number;
