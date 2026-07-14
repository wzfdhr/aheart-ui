import { type PropType } from 'vue';
import { type TooltipTitle } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly title: {
        type: PropType<TooltipTitle>;
        default: undefined;
    };
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly trigger: {
        readonly type: PropType<import("../utils/floating").FloatingTriggerProp>;
        readonly default: "hover";
        readonly validator: (value: unknown) => boolean;
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly color: StringConstructor;
    readonly align: PropType<import("./types").TooltipAlignConfig>;
    readonly arrow: {
        readonly type: PropType<import("./types").TooltipArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: PropType<import("./types").TooltipGetPopupContainer>;
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
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<import("vue").StyleValue>;
    readonly overlayInnerStyle: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<import("./types").TooltipClassNames>;
    readonly styles: PropType<import("./types").TooltipStyles>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    openChange: (open: boolean) => void;
    "update:open": (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly title: {
        type: PropType<TooltipTitle>;
        default: undefined;
    };
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly trigger: {
        readonly type: PropType<import("../utils/floating").FloatingTriggerProp>;
        readonly default: "hover";
        readonly validator: (value: unknown) => boolean;
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly color: StringConstructor;
    readonly align: PropType<import("./types").TooltipAlignConfig>;
    readonly arrow: {
        readonly type: PropType<import("./types").TooltipArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: PropType<import("./types").TooltipGetPopupContainer>;
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
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<import("vue").StyleValue>;
    readonly overlayInnerStyle: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<import("./types").TooltipClassNames>;
    readonly styles: PropType<import("./types").TooltipStyles>;
}>> & Readonly<{
    onOpenChange?: ((open: boolean) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
}>, {
    readonly title: TooltipTitle;
    readonly open: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly arrow: import("./types").TooltipArrow;
    readonly defaultOpen: boolean;
    readonly autoAdjustOverflow: boolean;
    readonly destroyOnHidden: boolean;
    readonly trigger: import("../utils/floating").FloatingTriggerProp;
    readonly mouseEnterDelay: number;
    readonly mouseLeaveDelay: number;
    readonly destroyTooltipOnHide: boolean;
    readonly fresh: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
    title?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
