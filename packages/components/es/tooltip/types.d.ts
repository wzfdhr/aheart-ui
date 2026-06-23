import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import { type FloatingTriggerProp } from '../utils/floating';
export interface TooltipArrowConfig {
    pointAtCenter?: boolean;
}
export type TooltipArrow = boolean | TooltipArrowConfig;
export type TooltipRenderable = VNodeChild;
export type TooltipRenderableFactory = () => VNodeChild;
export type TooltipTitle = TooltipRenderable | TooltipRenderableFactory;
export type TooltipGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export type TooltipSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'content' | 'arrow';
export type TooltipClassNames = Partial<Record<TooltipSemanticPart, string>>;
export type TooltipStyles = Partial<Record<TooltipSemanticPart, StyleValue>>;
export declare const tooltipProps: {
    readonly title: {
        type: PropType<TooltipTitle>;
        default: undefined;
    };
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
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
    readonly arrow: {
        readonly type: PropType<TooltipArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: PropType<TooltipGetPopupContainer>;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly fresh: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<StyleValue>;
    readonly overlayInnerStyle: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<TooltipSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<TooltipSemanticPart, StyleValue>>>;
};
export declare const tooltipEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
};
export type TooltipProps = ExtractPropTypes<typeof tooltipProps>;
