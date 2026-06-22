import type { ExtractPropTypes, PropType } from 'vue';
import { type FloatingTriggerProp } from '../utils/floating';
export declare const popoverProps: {
    readonly title: StringConstructor;
    readonly content: StringConstructor;
    readonly placement: {
        readonly type: PropType<"left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
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
};
export declare const popoverEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
};
export type PopoverProps = ExtractPropTypes<typeof popoverProps>;
