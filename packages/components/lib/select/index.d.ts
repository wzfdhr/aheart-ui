declare const Select: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly labelledBy: StringConstructor;
        readonly ariaLabelledby: StringConstructor;
        readonly name: StringConstructor;
        readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
        readonly defaultValue: import("vue").PropType<import("./types").SelectValue>;
        readonly options: import("vue").PropType<import("./types").SelectRawOption[]>;
        readonly placeholder: StringConstructor;
        readonly prefix: import("vue").PropType<import("vue").VNodeChild>;
        readonly suffixIcon: import("vue").PropType<import("vue").VNodeChild>;
        readonly loadingIcon: import("vue").PropType<import("vue").VNodeChild>;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly status: import("vue").PropType<import("./types").SelectStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").SelectVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: {
            readonly type: import("vue").PropType<import("./types").SelectAllowClear>;
            readonly default: false;
        };
        readonly mode: import("vue").PropType<import("./types").SelectMode>;
        readonly open: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultOpen: BooleanConstructor;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
            readonly default: "bottomLeft";
            readonly validator: (value: string) => boolean;
        };
        readonly autoAdjustOverflow: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly getPopupContainer: import("vue").PropType<import("./types").SelectGetPopupContainer>;
        readonly popupMatchSelectWidth: {
            readonly type: import("vue").PropType<number | boolean>;
            readonly default: true;
        };
        readonly showSearch: BooleanConstructor;
        readonly searchValue: StringConstructor;
        readonly optionFilterProp: {
            readonly type: StringConstructor;
            readonly default: "label";
        };
        readonly filterOption: {
            readonly type: import("vue").PropType<import("./types").SelectFilterOption>;
            readonly default: undefined;
        };
        readonly filterSort: import("vue").PropType<import("./types").SelectFilterSort>;
        readonly fieldNames: import("vue").PropType<import("./types").SelectFieldNames>;
        readonly notFoundContent: {
            readonly type: StringConstructor;
            readonly default: "Not Found";
        };
        readonly maxCount: NumberConstructor;
        readonly maxTagCount: NumberConstructor;
        readonly optionRender: import("vue").PropType<import("./types").SelectOptionRender>;
        readonly tagRender: import("vue").PropType<import("./types").SelectTagRender>;
        readonly loading: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SelectSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{
        onSearch?: ((value: string) => any) | undefined;
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((value: import("./types").SelectValue) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        onClear?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {
        focus: () => void | undefined;
        blur: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        search: (value: string) => void;
        blur: (event: FocusEvent) => void;
        change: (value: import("./types").SelectValue) => void;
        focus: (event: FocusEvent) => void;
        clear: () => void;
        "update:modelValue": (value: import("./types").SelectValue) => void;
        openChange: (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly variant: import("./types").SelectVariant;
        readonly classNames: Partial<Record<import("./types").SelectSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>;
        readonly open: boolean;
        readonly disabled: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly loading: boolean;
        readonly bordered: boolean;
        readonly showSearch: boolean;
        readonly defaultOpen: boolean;
        readonly allowClear: import("./types").SelectAllowClear;
        readonly autoAdjustOverflow: boolean;
        readonly popupMatchSelectWidth: number | boolean;
        readonly optionFilterProp: string;
        readonly filterOption: import("./types").SelectFilterOption;
        readonly notFoundContent: string;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly labelledBy: StringConstructor;
        readonly ariaLabelledby: StringConstructor;
        readonly name: StringConstructor;
        readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
        readonly defaultValue: import("vue").PropType<import("./types").SelectValue>;
        readonly options: import("vue").PropType<import("./types").SelectRawOption[]>;
        readonly placeholder: StringConstructor;
        readonly prefix: import("vue").PropType<import("vue").VNodeChild>;
        readonly suffixIcon: import("vue").PropType<import("vue").VNodeChild>;
        readonly loadingIcon: import("vue").PropType<import("vue").VNodeChild>;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly status: import("vue").PropType<import("./types").SelectStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").SelectVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: {
            readonly type: import("vue").PropType<import("./types").SelectAllowClear>;
            readonly default: false;
        };
        readonly mode: import("vue").PropType<import("./types").SelectMode>;
        readonly open: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultOpen: BooleanConstructor;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
            readonly default: "bottomLeft";
            readonly validator: (value: string) => boolean;
        };
        readonly autoAdjustOverflow: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly getPopupContainer: import("vue").PropType<import("./types").SelectGetPopupContainer>;
        readonly popupMatchSelectWidth: {
            readonly type: import("vue").PropType<number | boolean>;
            readonly default: true;
        };
        readonly showSearch: BooleanConstructor;
        readonly searchValue: StringConstructor;
        readonly optionFilterProp: {
            readonly type: StringConstructor;
            readonly default: "label";
        };
        readonly filterOption: {
            readonly type: import("vue").PropType<import("./types").SelectFilterOption>;
            readonly default: undefined;
        };
        readonly filterSort: import("vue").PropType<import("./types").SelectFilterSort>;
        readonly fieldNames: import("vue").PropType<import("./types").SelectFieldNames>;
        readonly notFoundContent: {
            readonly type: StringConstructor;
            readonly default: "Not Found";
        };
        readonly maxCount: NumberConstructor;
        readonly maxTagCount: NumberConstructor;
        readonly optionRender: import("vue").PropType<import("./types").SelectOptionRender>;
        readonly tagRender: import("vue").PropType<import("./types").SelectTagRender>;
        readonly loading: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SelectSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{
        onSearch?: ((value: string) => any) | undefined;
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((value: import("./types").SelectValue) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        onClear?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {
        focus: () => void | undefined;
        blur: () => void;
    }, {}, {}, {}, {
        readonly variant: import("./types").SelectVariant;
        readonly classNames: Partial<Record<import("./types").SelectSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>;
        readonly open: boolean;
        readonly disabled: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly loading: boolean;
        readonly bordered: boolean;
        readonly showSearch: boolean;
        readonly defaultOpen: boolean;
        readonly allowClear: import("./types").SelectAllowClear;
        readonly autoAdjustOverflow: boolean;
        readonly popupMatchSelectWidth: number | boolean;
        readonly optionFilterProp: string;
        readonly filterOption: import("./types").SelectFilterOption;
        readonly notFoundContent: string;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly name: StringConstructor;
    readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
    readonly defaultValue: import("vue").PropType<import("./types").SelectValue>;
    readonly options: import("vue").PropType<import("./types").SelectRawOption[]>;
    readonly placeholder: StringConstructor;
    readonly prefix: import("vue").PropType<import("vue").VNodeChild>;
    readonly suffixIcon: import("vue").PropType<import("vue").VNodeChild>;
    readonly loadingIcon: import("vue").PropType<import("vue").VNodeChild>;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: import("vue").PropType<import("./types").SelectStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").SelectVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: import("vue").PropType<import("./types").SelectAllowClear>;
        readonly default: false;
    };
    readonly mode: import("vue").PropType<import("./types").SelectMode>;
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "bottomLeft";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: import("vue").PropType<import("./types").SelectGetPopupContainer>;
    readonly popupMatchSelectWidth: {
        readonly type: import("vue").PropType<number | boolean>;
        readonly default: true;
    };
    readonly showSearch: BooleanConstructor;
    readonly searchValue: StringConstructor;
    readonly optionFilterProp: {
        readonly type: StringConstructor;
        readonly default: "label";
    };
    readonly filterOption: {
        readonly type: import("vue").PropType<import("./types").SelectFilterOption>;
        readonly default: undefined;
    };
    readonly filterSort: import("vue").PropType<import("./types").SelectFilterSort>;
    readonly fieldNames: import("vue").PropType<import("./types").SelectFieldNames>;
    readonly notFoundContent: {
        readonly type: StringConstructor;
        readonly default: "Not Found";
    };
    readonly maxCount: NumberConstructor;
    readonly maxTagCount: NumberConstructor;
    readonly optionRender: import("vue").PropType<import("./types").SelectOptionRender>;
    readonly tagRender: import("vue").PropType<import("./types").SelectTagRender>;
    readonly loading: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").SelectSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{
    onSearch?: ((value: string) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: import("./types").SelectValue) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    focus: () => void | undefined;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    search: (value: string) => void;
    blur: (event: FocusEvent) => void;
    change: (value: import("./types").SelectValue) => void;
    focus: (event: FocusEvent) => void;
    clear: () => void;
    "update:modelValue": (value: import("./types").SelectValue) => void;
    openChange: (open: boolean) => void;
}, string, {
    readonly variant: import("./types").SelectVariant;
    readonly classNames: Partial<Record<import("./types").SelectSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>;
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly showSearch: boolean;
    readonly defaultOpen: boolean;
    readonly allowClear: import("./types").SelectAllowClear;
    readonly autoAdjustOverflow: boolean;
    readonly popupMatchSelectWidth: number | boolean;
    readonly optionFilterProp: string;
    readonly filterOption: import("./types").SelectFilterOption;
    readonly notFoundContent: string;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        prefix?(_: {}): any;
        clearIcon?(_: {}): any;
        loadingIcon?(_: {}): any;
        suffixIcon?(_: {}): any;
    };
})>;
export type * from './types';
export default Select;
