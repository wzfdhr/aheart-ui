import { type PropType } from 'vue';
export interface CascaderVirtualListExpose {
    focusIndex: (index: number) => void;
    focusFirst: () => void;
    focusLast: () => void;
    cancelFocus: () => void;
    suspend: () => void;
}
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    items: {
        type: PropType<any[]>;
        required: true;
    };
    config: {
        type: PropType<{
            height: number;
            estimateSize: number;
            overscan: number;
        }>;
        required: true;
    };
    className: {
        type: StringConstructor;
        required: true;
    };
    rowKey: {
        type: PropType<(index: number, option: any) => string>;
        required: true;
    };
    activeIndex: {
        type: NumberConstructor;
        default: number;
    };
    pinnedIndexes: {
        type: PropType<number[]>;
        default: () => never[];
    };
    disabledIndex: {
        type: PropType<(index: number, option: any) => boolean>;
        required: true;
    };
    enabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {
    focusIndex: (index: number) => void;
    focusFirst: () => void;
    focusLast: () => void;
    cancelFocus: () => void;
    suspend: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    items: {
        type: PropType<any[]>;
        required: true;
    };
    config: {
        type: PropType<{
            height: number;
            estimateSize: number;
            overscan: number;
        }>;
        required: true;
    };
    className: {
        type: StringConstructor;
        required: true;
    };
    rowKey: {
        type: PropType<(index: number, option: any) => string>;
        required: true;
    };
    activeIndex: {
        type: NumberConstructor;
        default: number;
    };
    pinnedIndexes: {
        type: PropType<number[]>;
        default: () => never[];
    };
    disabledIndex: {
        type: PropType<(index: number, option: any) => boolean>;
        required: true;
    };
    enabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    enabled: boolean;
    activeIndex: number;
    pinnedIndexes: number[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    row?(_: {
        index: number;
        option: any;
        tabindex: number;
    }): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
