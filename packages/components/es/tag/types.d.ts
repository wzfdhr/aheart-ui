import type { ExtractPropTypes, PropType } from 'vue';
export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | string;
export declare const tagProps: {
    readonly color: {
        readonly type: PropType<string>;
        readonly default: "default";
    };
    readonly closable: BooleanConstructor;
};
export declare const tagEmits: {
    close: (event: MouseEvent) => boolean;
};
export type TagProps = ExtractPropTypes<typeof tagProps>;
