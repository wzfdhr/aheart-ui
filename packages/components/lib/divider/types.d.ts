import type { ExtractPropTypes, PropType } from 'vue';
export type DividerType = 'horizontal' | 'vertical';
export type DividerOrientation = 'left' | 'center' | 'right';
export type DividerTitlePlacement = DividerOrientation | 'start' | 'end';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerSize = 'small' | 'middle' | 'large';
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
};
export type DividerProps = ExtractPropTypes<typeof dividerProps>;
