import { type SortableHandleProps } from './sortable-context';
import type { SortableChangeContext, SortableMoveEvent, SortableMoveRejectEvent, SortableRevision } from './types';
declare const _default: <TItem extends object = Record<string, unknown>>(__VLS_props: {
    disabled?: boolean | undefined;
    label?: string | undefined;
    readonly onChange?: ((items: TItem[], context?: SortableChangeContext | undefined) => any) | undefined;
    scopeKey?: string | number | undefined;
    group?: string | undefined;
    itemKey: string;
    revision?: SortableRevision | undefined;
    readonly onMoveReject?: ((event: SortableMoveRejectEvent) => any) | undefined;
    readonly onMoveStart?: ((event: SortableMoveEvent) => any) | undefined;
    readonly "onUpdate:items"?: ((items: TItem[]) => any) | undefined;
    readonly onMoveCommit?: ((event: SortableMoveEvent) => any) | undefined;
    items: TItem[];
    itemLabel?: ((item: TItem, index: number) => string) | undefined;
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
    emit: ((evt: "change", items: TItem[], context?: SortableChangeContext | undefined) => void) & ((evt: "update:items", items: TItem[]) => void) & ((evt: "moveStart", event: SortableMoveEvent) => void) & ((evt: "moveCommit", event: SortableMoveEvent) => void) & ((evt: "moveReject", event: SortableMoveRejectEvent) => void);
} | undefined, __VLS_expose?: ((exposed: import('vue').ShallowUnwrapRef<{}>) => void) | undefined, __VLS_setup?: Promise<{
    props: {
        disabled?: boolean | undefined;
        label?: string | undefined;
        readonly onChange?: ((items: TItem[], context?: SortableChangeContext | undefined) => any) | undefined;
        scopeKey?: string | number | undefined;
        group?: string | undefined;
        itemKey: string;
        revision?: SortableRevision | undefined;
        readonly onMoveReject?: ((event: SortableMoveRejectEvent) => any) | undefined;
        readonly onMoveStart?: ((event: SortableMoveEvent) => any) | undefined;
        readonly "onUpdate:items"?: ((items: TItem[]) => any) | undefined;
        readonly onMoveCommit?: ((event: SortableMoveEvent) => any) | undefined;
        items: TItem[];
        itemLabel?: ((item: TItem, index: number) => string) | undefined;
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
    emit: ((evt: "change", items: TItem[], context?: SortableChangeContext | undefined) => void) & ((evt: "update:items", items: TItem[]) => void) & ((evt: "moveStart", event: SortableMoveEvent) => void) & ((evt: "moveCommit", event: SortableMoveEvent) => void) & ((evt: "moveReject", event: SortableMoveRejectEvent) => void);
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            disabled?: boolean | undefined;
            label?: string | undefined;
            readonly onChange?: ((items: TItem[], context?: SortableChangeContext | undefined) => any) | undefined;
            scopeKey?: string | number | undefined;
            group?: string | undefined;
            itemKey: string;
            revision?: SortableRevision | undefined;
            readonly onMoveReject?: ((event: SortableMoveRejectEvent) => any) | undefined;
            readonly onMoveStart?: ((event: SortableMoveEvent) => any) | undefined;
            readonly "onUpdate:items"?: ((items: TItem[]) => any) | undefined;
            readonly onMoveCommit?: ((event: SortableMoveEvent) => any) | undefined;
            items: TItem[];
            itemLabel?: ((item: TItem, index: number) => string) | undefined;
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
        emit: ((evt: "change", items: TItem[], context?: SortableChangeContext | undefined) => void) & ((evt: "update:items", items: TItem[]) => void) & ((evt: "moveStart", event: SortableMoveEvent) => void) & ((evt: "moveCommit", event: SortableMoveEvent) => void) & ((evt: "moveReject", event: SortableMoveRejectEvent) => void);
    } | undefined;
};
export default _default;
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
