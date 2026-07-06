import type { PropType, VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
    readonly size: PropType<import("../config").AheartSize>;
    readonly autoFocus: BooleanConstructor;
    readonly checkedChildren: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly unCheckedChildren: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").SwitchSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").SwitchSemanticPart, import("vue").StyleValue>>>;
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
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
    readonly size: PropType<import("../config").AheartSize>;
    readonly autoFocus: BooleanConstructor;
    readonly checkedChildren: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly unCheckedChildren: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").SwitchSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").SwitchSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((checked: boolean, event: MouseEvent) => any) | undefined;
    onClick?: ((checked: boolean, event: MouseEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    "onUpdate:value"?: ((checked: boolean) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly value: boolean;
    readonly loading: boolean;
    readonly modelValue: boolean;
    readonly checked: boolean;
    readonly defaultChecked: boolean;
    readonly defaultValue: boolean;
    readonly autoFocus: boolean;
    readonly checkedChildren: VNodeChild;
    readonly unCheckedChildren: VNodeChild;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    checkedChildren?(_: {}): any;
    unCheckedChildren?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
