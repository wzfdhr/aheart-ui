import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import { type FloatingPlacement, type FloatingTriggerProp } from '../utils/floating';
export interface PopoverArrowConfig {
    pointAtCenter?: boolean;
}
export type PopoverArrow = boolean | PopoverArrowConfig;
export type PopoverRenderable = VNodeChild;
export type PopoverRenderableFactory = () => VNodeChild;
export type PopoverContent = PopoverRenderable | PopoverRenderableFactory;
export type PopoverGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export interface PopoverAlignConfig {
    offset?: [number, number];
    [key: string]: unknown;
}
export type PopoverSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'title' | 'content' | 'arrow';
export interface PopoverSemanticInfo {
    open: boolean;
    placement: FloatingPlacement;
}
export type PopoverSemanticClassNames = Partial<Record<PopoverSemanticPart, string>>;
export type PopoverSemanticStyles = Partial<Record<PopoverSemanticPart, StyleValue>>;
export type PopoverClassNames = PopoverSemanticClassNames | ((info: PopoverSemanticInfo) => PopoverSemanticClassNames);
export type PopoverStyles = PopoverSemanticStyles | ((info: PopoverSemanticInfo) => PopoverSemanticStyles);
export declare const popoverProps: {
    readonly title: {
        type: PropType<PopoverContent>;
        default: undefined;
    };
    readonly content: {
        type: PropType<PopoverContent>;
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
        readonly default: "hover";
        readonly validator: (value: unknown) => boolean;
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly color: StringConstructor;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyTooltipOnHide: BooleanConstructor;
    readonly fresh: BooleanConstructor;
    readonly align: PropType<PopoverAlignConfig>;
    readonly arrow: {
        readonly type: PropType<PopoverArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: PropType<PopoverGetPopupContainer>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<StyleValue>;
    readonly overlayInnerStyle: PropType<StyleValue>;
    readonly classNames: PropType<PopoverClassNames>;
    readonly styles: PropType<PopoverStyles>;
};
export declare const popoverEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
};
export type PopoverProps = ExtractPropTypes<typeof popoverProps>;
