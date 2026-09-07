import { type ComputedRef, type Ref } from 'vue';
import type { SelectOption } from './types';
/** Internal adapter: Select owns values, filtering, selection, focus and IDs. */
export declare function useSelectVirtual(input: {
    config: () => unknown;
    open: ComputedRef<boolean>;
    disabled: ComputedRef<boolean>;
    popup: Ref<HTMLElement | null>;
    options: ComputedRef<SelectOption[]>;
    activeIndex: ComputedRef<number>;
    activeKey: Ref<string | undefined>;
    key: (option: SelectOption) => string;
}): {
    config: ComputedRef<import("./virtual-options").ResolvedSelectVirtual | null>;
    rows: ComputedRef<{
        option: SelectOption;
        index: number;
        item: import("@tanstack/vue-virtual").VirtualItem;
    }[] | {
        option: SelectOption;
        index: number;
        item: undefined;
    }[]>;
    listStyle: ComputedRef<{
        height: string;
        position: "relative";
        display: string;
    } | undefined>;
    popupStyle: ComputedRef<{
        maxHeight: string;
        overflowAnchor: "none";
    } | undefined>;
    rowStyle: (row: {
        option: SelectOption;
        index: number;
        item: import("@tanstack/vue-virtual").VirtualItem;
    } | {
        option: SelectOption;
        index: number;
        item: undefined;
    }) => {
        position: "absolute";
        top: string;
        left: string;
        width: string;
        transform: string;
    } | undefined;
    measure: (element: unknown) => void;
};
