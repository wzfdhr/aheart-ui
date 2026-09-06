export interface OverlayRegistration {
    id: symbol;
    document?: Document;
    getTrigger?: () => Element | null | undefined;
    getContent?: () => Element | null | undefined;
    escapeEnabled?: boolean | (() => boolean);
    getBaseZIndex?: () => number;
    onZIndexChange?: (zIndex: number) => void;
    onEscape?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: PointerEvent) => void;
}
export declare const getRecentPointerTarget: (ownerDocument?: Document, maxAge?: number) => Element | null;
export declare const refreshOverlayStack: (ownerDocument?: Document) => void;
/** True when target is in this overlay or in an overlay opened from its content. */
export declare const isTargetInOverlayTree: (id: symbol, target: EventTarget | null | readonly EventTarget[], ownerDocument?: Document) => boolean;
/** Installs the lightweight input tracker before a closed blocking overlay is opened. */
export declare const prepareOverlayDocument: (ownerDocument?: Document) => void;
export declare const registerOverlay: (registration: OverlayRegistration) => () => void;
export declare const updateOverlay: (id: symbol, patch: Partial<Omit<OverlayRegistration, 'id' | 'document'>>, ownerDocument?: Document) => void;
export declare const unregisterOverlay: (id: symbol, ownerDocument?: Document) => void;
export declare const isTopmost: (id: symbol, ownerDocument?: Document) => boolean;
export declare const lockBodyScroll: (ownerDocument?: Document) => void;
export declare const unlockBodyScroll: (ownerDocument?: Document) => void;
