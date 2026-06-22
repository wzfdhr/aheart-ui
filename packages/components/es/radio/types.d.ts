import type { ExtractPropTypes } from 'vue';
export declare const radioProps: {
    readonly modelValue: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly label: StringConstructor;
    readonly name: StringConstructor;
};
export declare const radioEmits: {
    'update:modelValue': (checked: boolean) => boolean;
    change: (checked: boolean) => boolean;
};
export type RadioProps = ExtractPropTypes<typeof radioProps>;
