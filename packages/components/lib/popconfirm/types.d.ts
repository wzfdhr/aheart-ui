import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { ButtonProps } from '../button/types';
import { type FloatingTriggerProp } from '../utils/floating';
export type PopconfirmButtonProps = Partial<ButtonProps>;
export type PopconfirmRenderable = VNodeChild;
export type PopconfirmRenderableFactory = () => VNodeChild;
export type PopconfirmContent = PopconfirmRenderable | PopconfirmRenderableFactory;
export type PopconfirmGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export type PopconfirmSemanticPart = 'root' | 'trigger' | 'popup' | 'arrow' | 'message' | 'icon' | 'text' | 'title' | 'description' | 'actions' | 'cancelButton' | 'okButton';
export type PopconfirmClassNames = Partial<Record<PopconfirmSemanticPart, string>>;
export type PopconfirmStyles = Partial<Record<PopconfirmSemanticPart, StyleValue>>;
export declare const popconfirmProps: {
    readonly title: {
        type: PropType<PopconfirmContent>;
        default: undefined;
    };
    readonly description: {
        type: PropType<PopconfirmContent>;
        default: undefined;
    };
    readonly icon: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
    };
    readonly trigger: {
        readonly type: PropType<FloatingTriggerProp>;
        readonly default: "click";
        readonly validator: (value: unknown) => boolean;
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly okText: {
        readonly type: StringConstructor;
        readonly default: "OK";
    };
    readonly cancelText: {
        readonly type: StringConstructor;
        readonly default: "Cancel";
    };
    readonly okType: {
        readonly type: PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "primary";
    };
    readonly okButtonProps: PropType<Partial<ButtonProps>>;
    readonly cancelButtonProps: PropType<Partial<ButtonProps>>;
    readonly disabled: BooleanConstructor;
    readonly showCancel: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly color: StringConstructor;
    readonly arrow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: PropType<PopconfirmGetPopupContainer>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<PopconfirmSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<PopconfirmSemanticPart, StyleValue>>>;
};
export declare const popconfirmEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
    confirm: () => boolean;
    cancel: () => boolean;
    popupClick: (event: MouseEvent) => boolean;
};
export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>;
