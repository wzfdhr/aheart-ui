import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
export type DividerType = 'horizontal' | 'vertical';
export type DividerOrientation = 'left' | 'center' | 'right';
export type DividerTitlePlacement = DividerOrientation | 'start' | 'end';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerSize = 'small' | 'middle' | 'large';
export type DividerSemanticPart = 'root' | 'line' | 'text';
export type DividerClassNames = Partial<Record<DividerSemanticPart, string>>;
export type DividerStyles = Partial<Record<DividerSemanticPart, StyleValue>>;
export declare const dividerProps: {
    readonly type: {
        readonly type: PropType<DividerType>;
        readonly default: "horizontal";
    };
    readonly vertical: BooleanConstructor;
    readonly orientation: {
        readonly type: PropType<DividerOrientation>;
        readonly default: "center";
    };
    readonly titlePlacement: PropType<DividerTitlePlacement>;
    readonly orientationMargin: PropType<string | number>;
    readonly variant: {
        readonly type: PropType<DividerVariant>;
        readonly default: "solid";
    };
    readonly size: {
        readonly type: PropType<DividerSize>;
        readonly default: "middle";
    };
    readonly dashed: BooleanConstructor;
    readonly plain: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<DividerSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<DividerSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export type DividerProps = ExtractPropTypes<typeof dividerProps>;
