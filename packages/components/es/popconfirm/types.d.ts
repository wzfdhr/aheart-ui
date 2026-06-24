import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { ButtonProps } from '../button/types';
import { type FloatingPlacement, type FloatingTriggerProp } from '../utils/floating';
export type PopconfirmButtonProps = Partial<ButtonProps>;
export type PopconfirmRenderable = VNodeChild;
export type PopconfirmRenderableFactory = () => VNodeChild;
export type PopconfirmContent = PopconfirmRenderable | PopconfirmRenderableFactory;
export type PopconfirmGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export interface PopconfirmArrowConfig {
    pointAtCenter?: boolean;
}
export type PopconfirmArrow = boolean | PopconfirmArrowConfig;
export type PopconfirmSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'arrow' | 'message' | 'icon' | 'text' | 'title' | 'description' | 'actions' | 'cancelButton' | 'okButton';
export interface PopconfirmSemanticInfo {
    open: boolean;
    placement: FloatingPlacement;
}
export type PopconfirmSemanticClassNames = Partial<Record<PopconfirmSemanticPart, string>>;
export type PopconfirmSemanticStyles = Partial<Record<PopconfirmSemanticPart, StyleValue>>;
export type PopconfirmClassNames = PopconfirmSemanticClassNames | ((info: PopconfirmSemanticInfo) => PopconfirmSemanticClassNames);
export type PopconfirmStyles = PopconfirmSemanticStyles | ((info: PopconfirmSemanticInfo) => PopconfirmSemanticStyles);
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
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
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
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyTooltipOnHide: BooleanConstructor;
    readonly fresh: BooleanConstructor;
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
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly arrow: {
        readonly type: PropType<PopconfirmArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: PropType<PopconfirmGetPopupContainer>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<StyleValue>;
    readonly overlayInnerStyle: PropType<StyleValue>;
    readonly classNames: PropType<PopconfirmClassNames>;
    readonly styles: PropType<PopconfirmStyles>;
};
export declare const popconfirmEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
    confirm: () => boolean;
    cancel: () => boolean;
    popupClick: (event: MouseEvent) => boolean;
};
export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>;
