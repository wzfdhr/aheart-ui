import { type MaybeRefOrGetter } from 'vue';
type TriggerAriaValue = string | undefined;
type TriggerAriaAttributes = Record<`aria-${string}`, TriggerAriaValue>;
/** Mirrors wrapper-owned popup relationships onto the actual slotted focus target. */
export declare const useTriggerAria: (rootSource: MaybeRefOrGetter<HTMLElement | null | undefined>, getAttributes: () => TriggerAriaAttributes) => void;
export {};
