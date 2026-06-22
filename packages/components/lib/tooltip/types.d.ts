import type { ExtractPropTypes, PropType } from 'vue';
import { type FloatingTriggerProp } from '../utils/floating';
export declare const tooltipProps: {
    readonly title: StringConstructor;
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
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
};
export declare const tooltipEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
};
export type TooltipProps = ExtractPropTypes<typeof tooltipProps>;
