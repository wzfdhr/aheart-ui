import type { AIContentRenderer, AIMessage } from './types';
declare const _default: __VLS_WithTemplateSlots<import("@vue/runtime-core").DefineComponent<import("@vue/runtime-core").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    message: AIMessage;
    contentRenderer?: AIContentRenderer | undefined;
}>>, {}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    message: AIMessage;
    contentRenderer?: AIContentRenderer | undefined;
}>>> & Readonly<{}>, {}, {}, {}, {}, string, import("@vue/runtime-core").ComponentProvideOptions, true, {}, any>, {
    actions?(_: {
        message: AIMessage;
    }): any;
}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
