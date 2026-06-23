import { type PropType, type Ref, type VNodeChild } from 'vue';
import type { TypographyCopyable } from './types';
export declare const TypographyRenderNode: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    node: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
}>, () => VNodeChild, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    node: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
}>> & Readonly<{}>, {
    node: VNodeChild;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const useTypographyCopyable: (copyable: Ref<TypographyCopyable | undefined>, contentRef: Ref<HTMLElement | null>, disabled: Ref<boolean>) => {
    copied: Ref<boolean, boolean>;
    isCopyable: import("vue").ComputedRef<boolean>;
    copyIcon: import("vue").ComputedRef<VNodeChild>;
    copyTitle: import("vue").ComputedRef<string | undefined>;
    copyTabIndex: import("vue").ComputedRef<number>;
    handleCopy: (event: MouseEvent) => Promise<void>;
};
