declare const Form: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
    }>> & Readonly<{
        onSubmit?: ((event: Event) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        submit: (event: Event) => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly layout: import("./types").FormLayout;
        readonly labelAlign: import("./types").FormLabelAlign;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
    }>> & Readonly<{
        onSubmit?: ((event: Event) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly layout: import("./types").FormLayout;
        readonly labelAlign: import("./types").FormLabelAlign;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
}>> & Readonly<{
    onSubmit?: ((event: Event) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (event: Event) => void;
}, string, {
    readonly disabled: boolean;
    readonly layout: import("./types").FormLayout;
    readonly labelAlign: import("./types").FormLabelAlign;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export declare const FormItem: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly label: StringConstructor;
        readonly name: StringConstructor;
        readonly required: BooleanConstructor;
        readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
        readonly help: StringConstructor;
        readonly extra: StringConstructor;
        readonly hasFeedback: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
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
        readonly label: StringConstructor;
        readonly name: StringConstructor;
        readonly required: BooleanConstructor;
        readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
        readonly help: StringConstructor;
        readonly extra: StringConstructor;
        readonly hasFeedback: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly required: boolean;
        readonly hasFeedback: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly required: BooleanConstructor;
    readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
    readonly help: StringConstructor;
    readonly extra: StringConstructor;
    readonly hasFeedback: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
