import { type MaybeRefOrGetter, type ComputedRef } from 'vue';
/** Returns an explicit id when supplied, otherwise a Vue SSR-safe generated id. */
export declare const useStableId: (explicitId?: MaybeRefOrGetter<string | undefined>, prefix?: string) => ComputedRef<string>;
