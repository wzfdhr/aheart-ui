import type { ExtractPropTypes, PropType } from 'vue';
export type AlertType = 'success' | 'info' | 'warning' | 'error';
export declare const alertProps: {
    readonly type: {
        readonly type: PropType<AlertType>;
        readonly default: "info";
    };
    readonly message: StringConstructor;
    readonly description: StringConstructor;
    readonly showIcon: BooleanConstructor;
    readonly closable: BooleanConstructor;
};
export declare const alertEmits: {
    close: (event: MouseEvent) => boolean;
};
export type AlertProps = ExtractPropTypes<typeof alertProps>;
