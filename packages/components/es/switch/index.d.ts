declare const Switch: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly checked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly value: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultChecked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultValue: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly loading: BooleanConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly autoFocus: BooleanConstructor;
        readonly checkedChildren: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly unCheckedChildren: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").SwitchSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").SwitchSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((checked: boolean, event: MouseEvent) => any) | undefined;
        onClick?: ((checked: boolean, event: MouseEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
        "onUpdate:value"?: ((checked: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        nativeElement: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (checked: boolean, event: MouseEvent) => void;
        click: (checked: boolean, event: MouseEvent) => void;
        "update:modelValue": (checked: boolean) => void;
        "update:checked": (checked: boolean) => void;
        "update:value": (checked: boolean) => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly value: boolean;
        readonly loading: boolean;
        readonly modelValue: boolean;
        readonly checked: boolean;
        readonly defaultChecked: boolean;
        readonly defaultValue: boolean;
        readonly autoFocus: boolean;
        readonly checkedChildren: import("vue").VNodeChild;
        readonly unCheckedChildren: import("vue").VNodeChild;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly checked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly value: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultChecked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultValue: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly loading: BooleanConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly autoFocus: BooleanConstructor;
        readonly checkedChildren: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly unCheckedChildren: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").SwitchSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").SwitchSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((checked: boolean, event: MouseEvent) => any) | undefined;
        onClick?: ((checked: boolean, event: MouseEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
        "onUpdate:value"?: ((checked: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        nativeElement: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
    }, {}, {}, {}, {
        readonly disabled: boolean;
        readonly value: boolean;
        readonly loading: boolean;
        readonly modelValue: boolean;
        readonly checked: boolean;
        readonly defaultChecked: boolean;
        readonly defaultValue: boolean;
        readonly autoFocus: boolean;
        readonly checkedChildren: import("vue").VNodeChild;
        readonly unCheckedChildren: import("vue").VNodeChild;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly checked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultChecked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly autoFocus: BooleanConstructor;
    readonly checkedChildren: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly unCheckedChildren: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").SwitchSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").SwitchSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((checked: boolean, event: MouseEvent) => any) | undefined;
    onClick?: ((checked: boolean, event: MouseEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    "onUpdate:value"?: ((checked: boolean) => any) | undefined;
}>, {
    focus: () => void;
    blur: () => void;
    nativeElement: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (checked: boolean, event: MouseEvent) => void;
    click: (checked: boolean, event: MouseEvent) => void;
    "update:modelValue": (checked: boolean) => void;
    "update:checked": (checked: boolean) => void;
    "update:value": (checked: boolean) => void;
}, string, {
    readonly disabled: boolean;
    readonly value: boolean;
    readonly loading: boolean;
    readonly modelValue: boolean;
    readonly checked: boolean;
    readonly defaultChecked: boolean;
    readonly defaultValue: boolean;
    readonly autoFocus: boolean;
    readonly checkedChildren: import("vue").VNodeChild;
    readonly unCheckedChildren: import("vue").VNodeChild;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        checkedChildren?(_: {}): any;
        unCheckedChildren?(_: {}): any;
    };
})>;
export default Switch;
