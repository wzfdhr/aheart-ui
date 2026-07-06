declare const Form: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly model: {
            readonly type: import("vue").PropType<import("./types").FormModel>;
            readonly default: () => {};
        };
        readonly rules: {
            readonly type: import("vue").PropType<import("./types").FormRules>;
            readonly default: () => {};
        };
        readonly layout: {
            readonly type: import("vue").PropType<import("./types").FormLayout>;
            readonly default: "horizontal";
        };
        readonly labelAlign: {
            readonly type: import("vue").PropType<import("./types").FormLabelAlign>;
            readonly default: "right";
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly requiredMark: {
            readonly type: import("vue").PropType<import("./types").FormRequiredMark>;
            readonly default: true;
        };
        readonly colon: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly variant: {
            readonly type: import("vue").PropType<import("../config").AheartVariant>;
            readonly default: undefined;
        };
    }>> & Readonly<{
        onSubmit?: ((event: Event) => any) | undefined;
        onFinish?: ((values: import("./types").FormModel) => any) | undefined;
        onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
        onValidate?: ((name: string, status: boolean, errors: string[]) => any) | undefined;
    }>, {
        validate: () => {
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        };
        clearValidate: (names?: string[] | undefined) => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        submit: (event: Event) => void;
        finish: (values: import("./types").FormModel) => void;
        finishFailed: (info: import("./types").FormFinishFailedInfo) => void;
        validate: (name: string, status: boolean, errors: string[]) => void;
    }, import("vue").PublicProps, {
        readonly variant: import("../config").AheartVariant;
        readonly layout: import("./types").FormLayout;
        readonly disabled: boolean;
        readonly model: import("./types").FormModel;
        readonly rules: import("./types").FormRules;
        readonly labelAlign: import("./types").FormLabelAlign;
        readonly requiredMark: import("./types").FormRequiredMark;
        readonly colon: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly model: {
            readonly type: import("vue").PropType<import("./types").FormModel>;
            readonly default: () => {};
        };
        readonly rules: {
            readonly type: import("vue").PropType<import("./types").FormRules>;
            readonly default: () => {};
        };
        readonly layout: {
            readonly type: import("vue").PropType<import("./types").FormLayout>;
            readonly default: "horizontal";
        };
        readonly labelAlign: {
            readonly type: import("vue").PropType<import("./types").FormLabelAlign>;
            readonly default: "right";
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly requiredMark: {
            readonly type: import("vue").PropType<import("./types").FormRequiredMark>;
            readonly default: true;
        };
        readonly colon: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly variant: {
            readonly type: import("vue").PropType<import("../config").AheartVariant>;
            readonly default: undefined;
        };
    }>> & Readonly<{
        onSubmit?: ((event: Event) => any) | undefined;
        onFinish?: ((values: import("./types").FormModel) => any) | undefined;
        onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
        onValidate?: ((name: string, status: boolean, errors: string[]) => any) | undefined;
    }>, {
        validate: () => {
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        };
        clearValidate: (names?: string[] | undefined) => void;
    }, {}, {}, {}, {
        readonly variant: import("../config").AheartVariant;
        readonly layout: import("./types").FormLayout;
        readonly disabled: boolean;
        readonly model: import("./types").FormModel;
        readonly rules: import("./types").FormRules;
        readonly labelAlign: import("./types").FormLabelAlign;
        readonly requiredMark: import("./types").FormRequiredMark;
        readonly colon: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly model: {
        readonly type: import("vue").PropType<import("./types").FormModel>;
        readonly default: () => {};
    };
    readonly rules: {
        readonly type: import("vue").PropType<import("./types").FormRules>;
        readonly default: () => {};
    };
    readonly layout: {
        readonly type: import("vue").PropType<import("./types").FormLayout>;
        readonly default: "horizontal";
    };
    readonly labelAlign: {
        readonly type: import("vue").PropType<import("./types").FormLabelAlign>;
        readonly default: "right";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly requiredMark: {
        readonly type: import("vue").PropType<import("./types").FormRequiredMark>;
        readonly default: true;
    };
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: import("vue").PropType<import("../config").AheartVariant>;
        readonly default: undefined;
    };
}>> & Readonly<{
    onSubmit?: ((event: Event) => any) | undefined;
    onFinish?: ((values: import("./types").FormModel) => any) | undefined;
    onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
    onValidate?: ((name: string, status: boolean, errors: string[]) => any) | undefined;
}>, {
    validate: () => {
        values: import("./types").FormModel;
        errorFields: import("./types").FormValidationError[];
    };
    clearValidate: (names?: string[] | undefined) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (event: Event) => void;
    finish: (values: import("./types").FormModel) => void;
    finishFailed: (info: import("./types").FormFinishFailedInfo) => void;
    validate: (name: string, status: boolean, errors: string[]) => void;
}, string, {
    readonly variant: import("../config").AheartVariant;
    readonly layout: import("./types").FormLayout;
    readonly disabled: boolean;
    readonly model: import("./types").FormModel;
    readonly rules: import("./types").FormRules;
    readonly labelAlign: import("./types").FormLabelAlign;
    readonly requiredMark: import("./types").FormRequiredMark;
    readonly colon: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export declare const FormItem: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly label: import("vue").PropType<import("vue").VNodeChild>;
        readonly name: StringConstructor;
        readonly required: BooleanConstructor;
        readonly rules: import("vue").PropType<import("./types").FormRule[]>;
        readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
        readonly help: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly extra: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly hasFeedback: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly help: import("vue").VNodeChild;
        readonly extra: import("vue").VNodeChild;
        readonly required: boolean;
        readonly hasFeedback: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly label: import("vue").PropType<import("vue").VNodeChild>;
        readonly name: StringConstructor;
        readonly required: BooleanConstructor;
        readonly rules: import("vue").PropType<import("./types").FormRule[]>;
        readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
        readonly help: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly extra: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly hasFeedback: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly help: import("vue").VNodeChild;
        readonly extra: import("vue").VNodeChild;
        readonly required: boolean;
        readonly hasFeedback: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly label: import("vue").PropType<import("vue").VNodeChild>;
    readonly name: StringConstructor;
    readonly required: BooleanConstructor;
    readonly rules: import("vue").PropType<import("./types").FormRule[]>;
    readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
    readonly help: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly extra: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly hasFeedback: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly help: import("vue").VNodeChild;
    readonly extra: import("vue").VNodeChild;
    readonly required: boolean;
    readonly hasFeedback: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        label?(_: {}): any;
        default?(_: {}): any;
        help?(_: {}): any;
        extra?(_: {}): any;
    };
})>;
export { FormItem as AFormItem };
export default Form;
