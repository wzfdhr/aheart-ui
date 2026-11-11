import { type UseFloatingDismissOptions } from './use-floating-dismiss';
import { type UseFloatingPositionOptions } from './use-floating-position';
type PopupContainer = (trigger: HTMLElement) => HTMLElement | false;
interface UseFloatingLayerOptions {
    reference: UseFloatingPositionOptions['reference'];
    floating: UseFloatingPositionOptions['floating'];
    getPopupContainer?: () => PopupContainer | undefined;
    position: Omit<UseFloatingPositionOptions, 'reference' | 'floating'>;
    dismiss: Omit<UseFloatingDismissOptions, 'floating' | 'trigger'>;
}
/** Bind an anchored panel to positioning, Teleport and the document's dismiss stack. */
export declare function useFloatingLayer({ reference, floating, getPopupContainer, position, dismiss }: UseFloatingLayerOptions): {
    floatingPosition: import("./use-floating-position").UseFloatingPositionReturn;
    shouldTeleport: import("vue").ComputedRef<boolean>;
    teleportTo: import("vue").ComputedRef<string | HTMLElement>;
};
export {};
