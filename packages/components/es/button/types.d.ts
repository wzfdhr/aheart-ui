import type { ExtractPropTypes, PropType } from 'vue';
export declare const buttonTypes: readonly ["default", "primary", "success", "warning", "danger"];
export declare const buttonSizes: readonly ["large", "normal", "small", "mini"];
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
        readonly type: PropType<"large" | "normal" | "small" | "mini">;
        readonly default: "normal";
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: PropType<"button" | "submit" | "reset">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
};
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
