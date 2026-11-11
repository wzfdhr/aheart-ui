/** Keep content inline through hydration and when a consumer returns false. */
export declare function useOverlayPortal(resolveTarget: () => HTMLElement | string | false): {
    shouldTeleport: import("vue").ComputedRef<boolean>;
    teleportTo: import("vue").ComputedRef<string | HTMLElement>;
};
