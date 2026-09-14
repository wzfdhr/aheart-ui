import { type ComputedRef, type Ref } from 'vue';
import type { FloatingPlacement } from './floating-core';
interface PopupViewportBudgetOptions {
    trigger: Ref<HTMLElement | null>;
    popup: Ref<HTMLElement | null>;
    placement: Ref<FloatingPlacement>;
    open: ComputedRef<boolean>;
    maximum: ComputedRef<number>;
    search?: Ref<HTMLInputElement | null>;
}
export declare function usePopupViewportBudget(options: PopupViewportBudgetOptions): ComputedRef<{
    treeHeight: number;
    popupHeight: number;
}>;
export {};
