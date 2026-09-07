import { type MaybeRefOrGetter, type Ref } from 'vue';
export interface UseControllableStateOptions<T> {
    /** Presence of this property opts into controlled mode, including an undefined value. */
    controlled?: MaybeRefOrGetter<T | undefined>;
    /** Overrides property-presence detection when controlledness changes at runtime. */
    isControlled?: MaybeRefOrGetter<boolean>;
    defaultValue?: MaybeRefOrGetter<T | undefined>;
    onChange?: (value: T | undefined) => void;
}
export interface UseControllableStateReturn<T> {
    state: Readonly<Ref<T | undefined>>;
    isControlled: Readonly<Ref<boolean>>;
    setState: (next: T | undefined | ((current: T | undefined) => T | undefined), options?: {
        force?: boolean;
    }) => boolean;
}
/**
 * Small internal state bridge for controls that support both v-model and defaults.
 * Controlled state is always read from its owner, so rejected update events cannot
 * leave an optimistic value behind.
 */
export declare const useControllableState: <T>(options: UseControllableStateOptions<T>) => UseControllableStateReturn<T>;
