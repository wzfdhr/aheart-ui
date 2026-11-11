import { type Ref } from 'vue';
interface UseDialogLayerOptions {
    id: symbol;
    content: Readonly<Ref<HTMLElement | null>>;
    getContainer: () => HTMLElement | string | (() => HTMLElement) | false | undefined;
    getZIndex: () => number;
    escapeEnabled: () => boolean;
    onEscape: () => void;
}
/** Own stack registration and the scroll lock until the caller finishes its exit. */
export declare function useDialogLayer(options: UseDialogLayerOptions): {
    effectiveZIndex: Ref<number, number>;
    getActiveDocument: () => Document;
    register: () => void;
    unregister: () => void;
    prepare: () => void;
    isTopmost: () => boolean;
    captureTrigger: () => void;
    captureFocusBeforeClose: (isLeaving: () => boolean) => void;
    restoreTriggerFocus: (enabled: boolean) => void;
    shouldTeleport: import("vue").ComputedRef<boolean>;
    teleportTo: import("vue").ComputedRef<string | HTMLElement>;
};
export {};
