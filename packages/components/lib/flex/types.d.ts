import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexGap = AheartSize | number;
export declare const flexProps: {
    readonly vertical: BooleanConstructor;
    readonly wrap: PropType<string | boolean>;
    readonly justify: PropType<FlexJustify>;
    readonly align: PropType<FlexAlign>;
    readonly gap: PropType<FlexGap>;
};
export type FlexProps = ExtractPropTypes<typeof flexProps>;
