import { type Ref } from 'vue';
import type { NormalizedTableVirtual } from './virtual-options';
export declare function useTableVirtual(options: Ref<NormalizedTableVirtual>, count: Ref<number>, scrollElement: Ref<HTMLElement | null>): {
    range: import("vue").ComputedRef<import("./virtual-rows").VirtualRange>;
    scrollTop: Ref<number, number>;
    measured: Ref<Map<number, number> & Omit<Map<number, number>, keyof Map<any, any>>, Map<number, number> | (Map<number, number> & Omit<Map<number, number>, keyof Map<any, any>>)>;
    setMeasured: (index: number, height: number) => void;
    onScroll: () => void;
};
