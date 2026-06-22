import type { ExtractPropTypes, PropType } from 'vue';
import { type FloatingTriggerProp } from '../utils/floating';
export declare const popconfirmProps: {
    readonly title: StringConstructor;
    readonly description: StringConstructor;
    readonly placement: {
        readonly type: PropType<"left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
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
        readonly type: PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
        readonly default: "primary";
    };
    readonly disabled: BooleanConstructor;
    readonly showCancel: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly arrow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
};
export declare const popconfirmEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
    confirm: () => boolean;
    cancel: () => boolean;
};
export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>;
