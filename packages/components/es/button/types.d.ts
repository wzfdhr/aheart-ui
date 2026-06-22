import type { ExtractPropTypes, PropType } from 'vue';
export declare const buttonTypes: readonly ["default", "primary", "success", "warning", "danger"];
export declare const buttonSizes: readonly ["large", "normal", "middle", "small", "mini"];
export declare const nativeButtonTypes: readonly ["button", "submit", "reset"];
export type ButtonType = (typeof buttonTypes)[number];
export type ButtonSize = (typeof buttonSizes)[number];
export type NativeButtonType = (typeof nativeButtonTypes)[number];
export declare const buttonProps: {
    readonly type: {
        readonly type: PropType<"default" | "primary" | "success" | "warning" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: PropType<"large" | "middle" | "small" | "normal" | "mini">;
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: PropType<"button" | "submit" | "reset">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
};
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
