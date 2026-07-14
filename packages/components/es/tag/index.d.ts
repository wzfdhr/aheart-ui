declare const Tag: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly color: {
            readonly type: import("vue").PropType<string>;
            readonly default: "default";
        };
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").TagVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly closable: BooleanConstructor;
        readonly closeIcon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly icon: import("vue").PropType<import("vue").VNodeChild>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly href: StringConstructor;
        readonly target: StringConstructor;
        readonly rel: StringConstructor;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{
        onClose?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        close: (event: MouseEvent) => void;
    }, import("vue").PublicProps, {
        readonly closable: boolean;
        readonly variant: import("./types").TagVariant;
        readonly closeIcon: import("vue").VNodeChild;
        readonly classNames: Partial<Record<import("./types").TagSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>;
        readonly color: string;
        readonly disabled: boolean;
        readonly bordered: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly color: {
            readonly type: import("vue").PropType<string>;
            readonly default: "default";
        };
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").TagVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly closable: BooleanConstructor;
        readonly closeIcon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly icon: import("vue").PropType<import("vue").VNodeChild>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly href: StringConstructor;
        readonly target: StringConstructor;
        readonly rel: StringConstructor;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{
        onClose?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly closable: boolean;
        readonly variant: import("./types").TagVariant;
        readonly closeIcon: import("vue").VNodeChild;
        readonly classNames: Partial<Record<import("./types").TagSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>;
        readonly color: string;
        readonly disabled: boolean;
        readonly bordered: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly color: {
        readonly type: import("vue").PropType<string>;
        readonly default: "default";
    };
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").TagVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: BooleanConstructor;
    readonly closeIcon: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
    readonly icon: import("vue").PropType<import("vue").VNodeChild>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly rel: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{
    onClose?: ((event: MouseEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (event: MouseEvent) => void;
}, string, {
    readonly closable: boolean;
    readonly variant: import("./types").TagVariant;
    readonly closeIcon: import("vue").VNodeChild;
    readonly classNames: Partial<Record<import("./types").TagSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>;
    readonly color: string;
    readonly disabled: boolean;
    readonly bordered: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        icon?(_: {}): any;
        default?(_: {}): any;
        closeIcon?(_: {}): any;
    };
})>;
export declare const CheckableTag: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly checked: BooleanConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly icon: import("vue").PropType<import("vue").VNodeChild>;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{
        onChange?: ((checked: boolean, event: MouseEvent) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (checked: boolean, event: MouseEvent) => void;
        "update:checked": (checked: boolean) => void;
    }, import("vue").PublicProps, {
        readonly classNames: Partial<Record<import("./types").TagSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>;
        readonly disabled: boolean;
        readonly checked: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly checked: BooleanConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly icon: import("vue").PropType<import("vue").VNodeChild>;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{
        onChange?: ((checked: boolean, event: MouseEvent) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly classNames: Partial<Record<import("./types").TagSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>;
        readonly disabled: boolean;
        readonly checked: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly checked: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly icon: import("vue").PropType<import("vue").VNodeChild>;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{
    onChange?: ((checked: boolean, event: MouseEvent) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (checked: boolean, event: MouseEvent) => void;
    "update:checked": (checked: boolean) => void;
}, string, {
    readonly classNames: Partial<Record<import("./types").TagSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").TagSemanticPart, import("vue").StyleValue>>;
    readonly disabled: boolean;
    readonly checked: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        icon?(_: {}): any;
        default?(_: {}): any;
    };
})>;
export declare const TagGroup: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").TagGroupValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<import("./types").TagGroupValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<import("./types").TagGroupValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").TagRawOption[]>;
        readonly default: () => never[];
    };
    readonly multiple: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagGroupSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagGroupSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: unknown) => void;
    "update:modelValue": (value: unknown) => void;
    "update:value": (value: unknown) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").TagGroupValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<import("./types").TagGroupValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<import("./types").TagGroupValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").TagRawOption[]>;
        readonly default: () => never[];
    };
    readonly multiple: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagGroupSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").TagGroupSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{
    onChange?: ((value: unknown) => any) | undefined;
    "onUpdate:modelValue"?: ((value: unknown) => any) | undefined;
    "onUpdate:value"?: ((value: unknown) => any) | undefined;
}>, {
    readonly classNames: Partial<Record<import("./types").TagGroupSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").TagGroupSemanticPart, import("vue").StyleValue>>;
    readonly multiple: boolean;
    readonly disabled: boolean;
    readonly value: import("./types").TagGroupValue;
    readonly options: import("./types").TagRawOption[];
    readonly modelValue: import("./types").TagGroupValue;
    readonly defaultValue: import("./types").TagGroupValue;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export { CheckableTag as ACheckableTag, TagGroup as ATagGroup };
export type { CheckableTagProps, TagClassNames, TagColor, TagGroupClassNames, TagGroupProps, TagGroupSemanticPart, TagGroupStyles, TagGroupValue, TagIcon, TagOption, TagProps, TagRawOption, TagSemanticPart, TagStyles, TagValue, TagVariant } from './types';
export default Tag;
