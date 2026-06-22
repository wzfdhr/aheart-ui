import { type PropType, type VNodeChild } from 'vue';
import { type AlertClosableConfig } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: PropType<import("./types").AlertType>;
        readonly default: undefined;
    };
    readonly title: PropType<VNodeChild>;
    readonly message: PropType<VNodeChild>;
    readonly description: PropType<VNodeChild>;
    readonly showIcon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: {
        readonly type: PropType<boolean | AlertClosableConfig>;
        readonly default: false;
    };
    readonly banner: BooleanConstructor;
    readonly variant: {
        readonly type: PropType<import("./types").AlertVariant>;
        readonly default: "outlined";
    };
    readonly action: PropType<VNodeChild>;
    readonly icon: PropType<VNodeChild>;
    readonly closeIcon: PropType<VNodeChild>;
    readonly role: {
        readonly type: StringConstructor;
        readonly default: "alert";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").AlertSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").AlertSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (event: MouseEvent) => void;
    afterClose: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: PropType<import("./types").AlertType>;
        readonly default: undefined;
    };
    readonly title: PropType<VNodeChild>;
    readonly message: PropType<VNodeChild>;
    readonly description: PropType<VNodeChild>;
    readonly showIcon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: {
        readonly type: PropType<boolean | AlertClosableConfig>;
        readonly default: false;
    };
    readonly banner: BooleanConstructor;
    readonly variant: {
        readonly type: PropType<import("./types").AlertVariant>;
        readonly default: "outlined";
    };
    readonly action: PropType<VNodeChild>;
    readonly icon: PropType<VNodeChild>;
    readonly closeIcon: PropType<VNodeChild>;
    readonly role: {
        readonly type: StringConstructor;
        readonly default: "alert";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").AlertSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").AlertSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onClose?: ((event: MouseEvent) => any) | undefined;
    onAfterClose?: (() => any) | undefined;
}>, {
    readonly type: import("./types").AlertType;
    readonly showIcon: boolean;
    readonly closable: boolean | AlertClosableConfig;
    readonly banner: boolean;
    readonly variant: import("./types").AlertVariant;
    readonly role: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    icon?(_: {}): any;
    default?(_: {}): any;
    action?(_: {}): any;
    closeIcon?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
