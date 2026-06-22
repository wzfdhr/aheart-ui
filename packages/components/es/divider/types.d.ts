import type { ExtractPropTypes, PropType } from 'vue';
export type DividerType = 'horizontal' | 'vertical';
export type DividerOrientation = 'left' | 'center' | 'right';
export declare const dividerProps: {
    readonly type: {
        readonly type: PropType<DividerType>;
        readonly default: "horizontal";
    };
    readonly orientation: {
        readonly type: PropType<DividerOrientation>;
        readonly default: "center";
    };
    readonly dashed: BooleanConstructor;
    readonly plain: BooleanConstructor;
};
export type DividerProps = ExtractPropTypes<typeof dividerProps>;
