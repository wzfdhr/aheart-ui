import { type Ref } from 'vue';
import type { NormalizedTableVirtual } from './virtual-options';
export declare function useTableVirtual(options: Ref<NormalizedTableVirtual>, count: Ref<number>, scrollElement: Ref<HTMLElement | null>, getItemKey?: (index: number) => string): {
    virtualizer: Ref<import("@tanstack/vue-virtual").Virtualizer<HTMLElement, HTMLElement>, import("@tanstack/vue-virtual").Virtualizer<HTMLElement, HTMLElement>>;
    range: import("vue").ComputedRef<{
        start: number;
        end: number;
        top: number;
        bottom: number;
    }>;
    measured: Ref<Map<number, number> & Omit<Map<number, number>, keyof Map<any, any>>, Map<number, number> | (Map<number, number> & Omit<Map<number, number>, keyof Map<any, any>>)>;
    setMeasured: (index: number, height: number, part?: string) => void;
    clearMeasured: (index: number, part?: string) => void;
    setPinnedIndex: (index: number | undefined) => void;
    onScroll: () => void;
    pinnedIndex: Ref<number | undefined, number | undefined>;
};
