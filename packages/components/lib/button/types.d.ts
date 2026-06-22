import type { ExtractPropTypes, PropType } from 'vue';
export declare const buttonTypes: readonly ["default", "primary", "dashed", "link", "text", "success", "warning", "danger"];
export declare const buttonSizes: readonly ["large", "normal", "middle", "small", "mini"];
export declare const nativeButtonTypes: readonly ["button", "submit", "reset"];
export declare const buttonShapes: readonly ["default", "circle", "round"];
export type ButtonType = (typeof buttonTypes)[number];
export type ButtonSize = (typeof buttonSizes)[number];
export type NativeButtonType = (typeof nativeButtonTypes)[number];
export type ButtonShape = (typeof buttonShapes)[number];
export declare const buttonProps: {
    readonly type: {
        readonly type: PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: PropType<"small" | "normal" | "middle" | "large" | "mini">;
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: PropType<"reset" | "submit" | "button">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly htmlType: {
        readonly type: PropType<"reset" | "submit" | "button">;
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
    readonly danger: BooleanConstructor;
    readonly ghost: BooleanConstructor;
    readonly shape: {
        readonly type: PropType<"default" | "round" | "circle">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly href: StringConstructor;
    readonly target: StringConstructor;
};
export declare const buttonEmits: {
    click: (event: MouseEvent) => boolean;
};
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
