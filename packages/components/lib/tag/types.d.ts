import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type TagColor = 'default' | 'primary' | 'success' | 'processing' | 'warning' | 'danger' | 'error' | string;
export type TagVariant = 'filled' | 'solid' | 'outlined';
export type TagValue = string | number;
export type TagRenderable = VNodeChild;
export type TagIcon = TagRenderable;
export type TagSemanticPart = 'root' | 'icon' | 'content' | 'close';
export type TagGroupSemanticPart = 'root' | 'item' | 'activeItem';
export type TagClassNames = Partial<Record<TagSemanticPart, string>>;
export type TagStyles = Partial<Record<TagSemanticPart, StyleValue>>;
export type TagGroupClassNames = Partial<Record<TagGroupSemanticPart, string>>;
export type TagGroupStyles = Partial<Record<TagGroupSemanticPart, StyleValue>>;
export type TagGroupValue = TagValue | TagValue[] | null;
export type TagRawOption = TagValue | TagOption;
export interface TagOption {
    label: TagRenderable;
    value: TagValue;
    disabled?: boolean;
    icon?: TagIcon;
    className?: string;
    style?: StyleValue;
    title?: string;
}
export declare const tagProps: {
    readonly color: {
        readonly type: PropType<string>;
        readonly default: "default";
    };
    readonly variant: {
        readonly type: PropType<TagVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: BooleanConstructor;
    readonly closeIcon: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly icon: PropType<VNodeChild>;
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
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<TagSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<TagSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export declare const tagEmits: {
    close: (event: MouseEvent) => boolean;
};
export declare const checkableTagProps: {
    readonly checked: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly icon: PropType<VNodeChild>;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<TagSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<TagSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export declare const checkableTagEmits: {
    'update:checked': (checked: boolean) => boolean;
    change: (checked: boolean, event: MouseEvent) => boolean;
};
export declare const tagGroupProps: {
    readonly modelValue: {
        readonly type: PropType<TagGroupValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: PropType<TagGroupValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: PropType<TagGroupValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: PropType<TagRawOption[]>;
        readonly default: () => never[];
    };
    readonly multiple: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<TagGroupSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<TagGroupSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export declare const tagGroupEmits: {
    'update:modelValue': (value: unknown) => boolean;
    'update:value': (value: unknown) => boolean;
    change: (value: unknown) => boolean;
};
export type TagProps = ExtractPropTypes<typeof tagProps>;
export type CheckableTagProps = ExtractPropTypes<typeof checkableTagProps>;
export type TagGroupProps = ExtractPropTypes<typeof tagGroupProps>;
