import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export type FlexJustify = 'normal' | 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | string;
export type FlexAlign = 'normal' | 'start' | 'end' | 'center' | 'baseline' | 'stretch' | 'flex-start' | 'flex-end' | string;
export type FlexGap = AheartSize | 'medium' | number | string;
export type FlexWrap = boolean | 'nowrap' | 'wrap' | 'wrap-reverse' | 'reverse' | string;
export type FlexOrientation = 'horizontal' | 'vertical';
export declare const flexProps: {
    readonly vertical: BooleanConstructor;
    readonly orientation: PropType<FlexOrientation>;
    readonly wrap: PropType<FlexWrap>;
    readonly justify: PropType<string>;
    readonly align: PropType<string>;
    readonly gap: PropType<FlexGap>;
    readonly flex: PropType<string | number>;
    readonly component: {
        readonly type: PropType<string | object | Function>;
        readonly default: "div";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
};
export type FlexProps = ExtractPropTypes<typeof flexProps>;
