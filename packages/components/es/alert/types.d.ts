import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertVariant = 'outlined' | 'filled';
export type AlertSemanticPart = 'root' | 'icon' | 'content' | 'title' | 'description' | 'action' | 'close';
export type AlertClassNames = Partial<Record<AlertSemanticPart, string>>;
export type AlertStyles = Partial<Record<AlertSemanticPart, StyleValue>>;
export declare const alertProps: {
    readonly type: {
        readonly type: PropType<AlertType>;
        readonly default: undefined;
    };
    readonly title: StringConstructor;
    readonly message: StringConstructor;
    readonly description: StringConstructor;
    readonly showIcon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: BooleanConstructor;
    readonly banner: BooleanConstructor;
    readonly variant: {
        readonly type: PropType<AlertVariant>;
        readonly default: "outlined";
    };
    readonly action: StringConstructor;
    readonly icon: StringConstructor;
    readonly closeIcon: StringConstructor;
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
