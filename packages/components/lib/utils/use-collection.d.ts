import { type Ref } from 'vue';
export interface CollectionItem<T extends HTMLElement = HTMLElement> {
    key: string;
    element: T;
    disabled: boolean;
    visible: boolean;
}
export interface CollectionRegistration<T extends HTMLElement = HTMLElement> {
    key?: string;
    element: T;
    disabled?: boolean;
    visible?: boolean;
}
export interface UseCollectionReturn<T extends HTMLElement = HTMLElement> {
    items: Ref<CollectionItem<T>[]>;
    register: (item: CollectionRegistration<T>) => {
        key: string;
        unregister: () => void;
    };
    unregister: (key: string) => void;
    update: (key: string, patch: Partial<Pick<CollectionItem<T>, 'element' | 'disabled' | 'visible'>>) => void;
    getItem: (key: string) => CollectionItem<T> | undefined;
    getItems: () => CollectionItem<T>[];
    getVisibleItems: () => CollectionItem<T>[];
    getEnabledItems: () => CollectionItem<T>[];
    isVisible: (key: string) => boolean;
    isDisabled: (key: string) => boolean;
}
/** Internal ordered registry shared by composite components. */
export declare function useCollection<T extends HTMLElement = HTMLElement>(): UseCollectionReturn<T>;
