import type { ExtractPropTypes, PropType } from 'vue';
export declare const iconProps: {
    readonly name: StringConstructor;
    readonly size: PropType<string | number>;
    readonly color: StringConstructor;
    readonly spin: BooleanConstructor;
};
export type IconProps = ExtractPropTypes<typeof iconProps>;
