import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export type FormLabelAlign = 'left' | 'right';
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating';
export declare const formProps: {
    readonly layout: {
        readonly type: PropType<FormLayout>;
        readonly default: "horizontal";
    };
    readonly labelAlign: {
        readonly type: PropType<FormLabelAlign>;
        readonly default: "right";
    };
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
};
export declare const formEmits: {
    submit: (event: Event) => boolean;
};
export declare const formItemProps: {
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly required: BooleanConstructor;
    readonly validateStatus: PropType<FormValidateStatus>;
    readonly help: StringConstructor;
    readonly extra: StringConstructor;
    readonly hasFeedback: BooleanConstructor;
};
export type FormProps = ExtractPropTypes<typeof formProps>;
export type FormItemProps = ExtractPropTypes<typeof formItemProps>;
