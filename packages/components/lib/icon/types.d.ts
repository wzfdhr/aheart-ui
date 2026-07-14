import type { Component, ExtractPropTypes, PropType } from 'vue';
export declare const iconProps: {
    readonly name: StringConstructor;
    readonly component: PropType<Component>;
    readonly size: PropType<string | number>;
    readonly color: StringConstructor;
    readonly spin: BooleanConstructor;
};
export type IconProps = ExtractPropTypes<typeof iconProps>;
