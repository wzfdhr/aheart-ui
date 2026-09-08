import { type Ref } from 'vue';
import type { NormalizedTableVirtual } from './virtual-options';
export declare function useTableVirtual(options: Ref<NormalizedTableVirtual>, count: Ref<number>, scrollElement: Ref<HTMLElement | null>, getItemKey?: (index: number) => string, itemKeys?: Ref<readonly string[]>): {
    virtualizer: Ref<import("@tanstack/vue-virtual").Virtualizer<HTMLElement, HTMLElement>, import("@tanstack/vue-virtual").Virtualizer<HTMLElement, HTMLElement>>;
    range: import("vue").ComputedRef<{
        start: number;
        end: number;
        top: number;
        bottom: number;
    }>;
    items: import("vue").ComputedRef<import("@tanstack/vue-virtual").VirtualItem[]>;
    measured: Ref<Map<string, number> & Omit<Map<string, number>, keyof Map<any, any>>, Map<string, number> | (Map<string, number> & Omit<Map<string, number>, keyof Map<any, any>>)>;
    setMeasured: (index: number, height: number, part?: string) => void;
    clearMeasured: (index: number, part?: string) => void;
    setPinnedIndex: (index: number | undefined) => void;
    setPinnedIndexes: (indexes: number[]) => void;
    onScroll: () => void;
    pinnedIndex: Ref<number | undefined, number | undefined>;
};
