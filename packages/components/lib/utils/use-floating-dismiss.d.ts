import { type MaybeRefOrGetter } from 'vue';
type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>;
export type FloatingDismissReason = 'outside' | 'escape';
export interface UseFloatingDismissOptions {
    open: MaybeRefOrGetter<boolean>;
    trigger: ElementSource;
    floating: ElementSource;
    onDismiss: (reason: FloatingDismissReason, event: Event) => void;
    restoreFocus?: MaybeRefOrGetter<boolean | undefined>;
}
export declare function useFloatingDismiss(options: UseFloatingDismissOptions): void;
export {};
