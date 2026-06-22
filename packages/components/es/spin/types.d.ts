import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export type SpinPercent = number | 'auto';
export type SpinRenderable = VNodeChild;
export type SpinIndicator = VNodeChild | (() => VNodeChild);
export type SpinSemanticPart = 'root' | 'section' | 'indicator' | 'dot' | 'description' | 'tip' | 'percent' | 'container';
export type SpinClassNames = Partial<Record<SpinSemanticPart, string>>;
export type SpinStyles = Partial<Record<SpinSemanticPart, StyleValue>>;
export declare const spinProps: {
    readonly spinning: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly size: {
        readonly type: PropType<AheartSize>;
        readonly default: "middle";
    };
    readonly description: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly tip: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly delay: NumberConstructor;
    readonly indicator: PropType<SpinIndicator>;
    readonly percent: PropType<SpinPercent>;
    readonly fullscreen: BooleanConstructor;
    readonly wrapperClassName: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<SpinSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<SpinSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export type SpinProps = ExtractPropTypes<typeof spinProps>;
