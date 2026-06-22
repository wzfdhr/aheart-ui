import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type AlertRenderable = VNodeChild;
export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertVariant = 'outlined' | 'filled';
export type AlertSemanticPart = 'root' | 'icon' | 'content' | 'section' | 'title' | 'description' | 'action' | 'actions' | 'close';
export type AlertClassNames = Partial<Record<AlertSemanticPart, string>>;
export type AlertStyles = Partial<Record<AlertSemanticPart, StyleValue>>;
export interface AlertClosableConfig {
    closeIcon?: AlertRenderable;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    onClose?: (event: MouseEvent) => void;
    afterClose?: () => void;
}
export declare const alertProps: {
    readonly type: {
        readonly type: PropType<AlertType>;
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
        readonly type: PropType<AlertVariant>;
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
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<AlertSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<AlertSemanticPart, StyleValue>>>;
};
export declare const alertEmits: {
    close: (event: MouseEvent) => boolean;
    afterClose: () => boolean;
};
export type AlertProps = ExtractPropTypes<typeof alertProps>;
