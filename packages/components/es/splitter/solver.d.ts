import type { ResizeAdjacentPanelsOptions, ResolveSplitterSizesOptions, SplitterPanelConstraint } from './types';
export declare const resolveSplitterPanelBounds: (panel: SplitterPanelConstraint | undefined, containerSize?: number) => {
    min: number;
    max: number;
};
export declare const resolveSplitterSizes: ({ containerSize, sizes, panels }: ResolveSplitterSizesOptions) => number[];
export declare const resizeAdjacentPanels: ({ sizes, panels, containerSize, handleIndex, delta }: ResizeAdjacentPanelsOptions) => number[];
