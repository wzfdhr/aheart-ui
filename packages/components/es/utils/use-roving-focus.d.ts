import { type MaybeRefOrGetter } from 'vue';
import type { UseCollectionReturn } from './use-collection';
export type RovingOrientation = 'horizontal' | 'vertical' | 'both';
export interface UseRovingFocusOptions<T extends HTMLElement = HTMLElement> {
    collection: UseCollectionReturn<T> | MaybeRefOrGetter<UseCollectionReturn<T>>;
    orientation?: RovingOrientation | MaybeRefOrGetter<RovingOrientation>;
    loop?: boolean | MaybeRefOrGetter<boolean>;
    preventDefault?: boolean | MaybeRefOrGetter<boolean>;
}
export declare function useRovingFocus<T extends HTMLElement = HTMLElement>(options: UseRovingFocusOptions<T>): {
    getNextKey: (currentKey: string | undefined, key: string) => string | undefined;
    focus: (key: string, preventScroll?: boolean) => boolean;
    onKeydown: (event: KeyboardEvent, currentKey?: string) => boolean;
};
