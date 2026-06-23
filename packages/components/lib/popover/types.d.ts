import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import { type FloatingTriggerProp } from '../utils/floating';
export interface PopoverArrowConfig {
    pointAtCenter?: boolean;
}
export type PopoverArrow = boolean | PopoverArrowConfig;
export type PopoverRenderable = VNodeChild;
export type PopoverRenderableFactory = () => VNodeChild;
export type PopoverContent = PopoverRenderable | PopoverRenderableFactory;
export type PopoverSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'title' | 'content' | 'arrow';
export type PopoverClassNames = Partial<Record<PopoverSemanticPart, string>>;
export type PopoverStyles = Partial<Record<PopoverSemanticPart, StyleValue>>;
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
    readonly fresh: BooleanConstructor;
    readonly arrow: {
        readonly type: PropType<PopoverArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<StyleValue>;
    readonly overlayInnerStyle: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<PopoverSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<PopoverSemanticPart, StyleValue>>>;
};
export declare const popoverEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
};
export type PopoverProps = ExtractPropTypes<typeof popoverProps>;
