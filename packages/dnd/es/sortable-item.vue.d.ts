import { type SortableHandleProps } from './sortable-context';
declare const _default: <T = unknown>(__VLS_props: {
    index: number;
    item: T;
} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, __VLS_ctx?: {
    attrs: any;
    slots: Readonly<{
        default?: ((props: {
            item: T;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    }> & {
        default?: ((props: {
            item: T;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    };
    emit: any;
} | undefined, __VLS_expose?: ((exposed: import('vue').ShallowUnwrapRef<{}>) => void) | undefined, __VLS_setup?: Promise<{
    props: {
        index: number;
        item: T;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: Readonly<{
        default?: ((props: {
            item: T;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    }> & {
        default?: ((props: {
            item: T;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    };
    emit: any;
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            index: number;
            item: T;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
        expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
        attrs: any;
        slots: Readonly<{
            default?: ((props: {
                item: T;
                index: number;
                handleProps: SortableHandleProps;
            }) => unknown) | undefined;
        }> & {
            default?: ((props: {
                item: T;
                index: number;
                handleProps: SortableHandleProps;
            }) => unknown) | undefined;
        };
        emit: any;
    } | undefined;
};
export default _default;
