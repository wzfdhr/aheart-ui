import { type SortableHandleProps } from './sortable-context';
declare const _default: <TItem extends object = Record<string, unknown>>(__VLS_props: {
    disabled?: boolean | undefined;
    readonly onChange?: ((items: TItem[]) => any) | undefined;
    group?: string | undefined;
    readonly "onUpdate:items"?: ((items: TItem[]) => any) | undefined;
    items: TItem[];
    itemKey: string;
} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, __VLS_ctx?: {
    attrs: any;
    slots: Readonly<{
        item?: ((props: {
            item: TItem;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    }> & {
        item?: ((props: {
            item: TItem;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    };
    emit: ((evt: "change", items: TItem[]) => void) & ((evt: "update:items", items: TItem[]) => void);
} | undefined, __VLS_expose?: ((exposed: import('vue').ShallowUnwrapRef<{}>) => void) | undefined, __VLS_setup?: Promise<{
    props: {
        disabled?: boolean | undefined;
        readonly onChange?: ((items: TItem[]) => any) | undefined;
        group?: string | undefined;
        readonly "onUpdate:items"?: ((items: TItem[]) => any) | undefined;
        items: TItem[];
        itemKey: string;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: Readonly<{
        item?: ((props: {
            item: TItem;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    }> & {
        item?: ((props: {
            item: TItem;
            index: number;
            handleProps: SortableHandleProps;
        }) => unknown) | undefined;
    };
    emit: ((evt: "change", items: TItem[]) => void) & ((evt: "update:items", items: TItem[]) => void);
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            disabled?: boolean | undefined;
            readonly onChange?: ((items: TItem[]) => any) | undefined;
            group?: string | undefined;
            readonly "onUpdate:items"?: ((items: TItem[]) => any) | undefined;
            items: TItem[];
            itemKey: string;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
        expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
        attrs: any;
        slots: Readonly<{
            item?: ((props: {
                item: TItem;
                index: number;
                handleProps: SortableHandleProps;
            }) => unknown) | undefined;
        }> & {
            item?: ((props: {
                item: TItem;
                index: number;
                handleProps: SortableHandleProps;
            }) => unknown) | undefined;
        };
        emit: ((evt: "change", items: TItem[]) => void) & ((evt: "update:items", items: TItem[]) => void);
    } | undefined;
};
export default _default;
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
