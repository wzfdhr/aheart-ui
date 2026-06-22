import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
export declare const buttonTypes: readonly ["default", "primary", "dashed", "link", "text", "success", "warning", "danger"];
export declare const buttonSizes: readonly ["large", "normal", "middle", "small", "mini"];
export declare const nativeButtonTypes: readonly ["button", "submit", "reset"];
export declare const buttonShapes: readonly ["default", "circle", "round"];
export declare const buttonIconPlacements: readonly ["start", "end"];
export type ButtonType = (typeof buttonTypes)[number];
export type ButtonSize = (typeof buttonSizes)[number];
export type NativeButtonType = (typeof nativeButtonTypes)[number];
export type ButtonShape = (typeof buttonShapes)[number];
export type ButtonIconPlacement = (typeof buttonIconPlacements)[number];
export type ButtonLoading = boolean | {
    delay?: number;
};
export type ButtonSemanticPart = 'root' | 'icon' | 'content';
export type ButtonClassNames = Partial<Record<ButtonSemanticPart, string>>;
export type ButtonStyles = Partial<Record<ButtonSemanticPart, StyleValue>>;
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
    readonly loading: {
        readonly type: PropType<ButtonLoading>;
        readonly default: false;
    };
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
    readonly danger: BooleanConstructor;
    readonly ghost: BooleanConstructor;
    readonly shape: {
        readonly type: PropType<"default" | "round" | "circle">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly icon: StringConstructor;
    readonly iconPlacement: {
        readonly type: PropType<"end" | "start">;
        readonly validator: (value: string) => boolean;
    };
    readonly iconPosition: {
        readonly type: PropType<"end" | "start">;
        readonly validator: (value: string) => boolean;
    };
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<ButtonSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<ButtonSemanticPart, StyleValue>>>;
};
export declare const buttonEmits: {
    click: (event: MouseEvent) => boolean;
};
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
