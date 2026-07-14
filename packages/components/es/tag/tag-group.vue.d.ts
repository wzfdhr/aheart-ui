import { type PropType } from 'vue';
import { type TagGroupValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        readonly type: PropType<import("./types").TagRawOption[]>;
        readonly default: () => never[];
    };
    readonly multiple: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").TagGroupSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").TagGroupSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: unknown) => void;
    "update:modelValue": (value: unknown) => void;
    "update:value": (value: unknown) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
        readonly type: PropType<import("./types").TagRawOption[]>;
        readonly default: () => never[];
    };
    readonly multiple: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").TagGroupSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").TagGroupSemanticPart, import("vue").StyleValue>>>;
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
    readonly value: TagGroupValue;
    readonly options: import("./types").TagRawOption[];
    readonly modelValue: TagGroupValue;
    readonly defaultValue: TagGroupValue;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
