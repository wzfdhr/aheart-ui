import { autoUpdate, type AutoUpdateOptions, type Placement, type Side, type Strategy } from '@floating-ui/dom';
import { type CSSProperties, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue';
import type { FloatingPlacement } from './floating-core';
type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>;
export interface UseFloatingPositionOptions {
    reference: ElementSource;
    floating: ElementSource;
    arrow?: ElementSource;
    open?: MaybeRefOrGetter<boolean | undefined>;
    placement?: MaybeRefOrGetter<FloatingPlacement | undefined>;
    strategy?: MaybeRefOrGetter<Strategy | undefined>;
    offset?: MaybeRefOrGetter<number | undefined>;
    alignOffset?: MaybeRefOrGetter<readonly [number, number] | undefined>;
    autoAdjustOverflow?: MaybeRefOrGetter<boolean | undefined>;
    shift?: MaybeRefOrGetter<boolean | undefined>;
    viewportPadding?: MaybeRefOrGetter<number | undefined>;
    arrowSize?: MaybeRefOrGetter<number | undefined>;
    autoUpdateOptions?: AutoUpdateOptions;
}
export interface UseFloatingPositionReturn {
    placement: Ref<FloatingPlacement>;
    popupStyle: Ref<CSSProperties>;
    arrowStyle: Ref<CSSProperties>;
    arrowStaticSide: ComputedRef<Side>;
    update: () => Promise<void>;
}
export declare const toFloatingUIPlacement: (placement: FloatingPlacement) => Placement;
export declare const fromFloatingUIPlacement: (placement: Placement) => FloatingPlacement;
export declare const getFloatingArrowStaticSide: (placement: FloatingPlacement) => Side;
type FloatingAutoUpdate = typeof autoUpdate;
/**
 * Keep Floating UI's ancestor/layout-shift observers while owning element
 * resize scheduling in the reference element's document realm.
 *
 * Floating UI 1.8.0 can leave its internal element-resize reobserve RAF
 * pending after cleanup. Owning that small part here lets us cancel the exact
 * owner-realm handle without disabling element resize updates for consumers.
 */
export declare function createOwnerRealmAutoUpdate(reference: HTMLElement, floating: HTMLElement, update: () => void | Promise<void>, autoUpdateOptions?: AutoUpdateOptions, upstreamAutoUpdate?: FloatingAutoUpdate): () => void;
export declare function useFloatingPosition(options: UseFloatingPositionOptions): UseFloatingPositionReturn;
export {};
