import { type AutoUpdateOptions, type Placement, type Side, type Strategy } from '@floating-ui/dom';
import { type CSSProperties, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue';
import type { FloatingPlacement } from './floating';
type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>;
export interface UseFloatingPositionOptions {
    reference: ElementSource;
    floating: ElementSource;
    arrow?: ElementSource;
    open?: MaybeRefOrGetter<boolean | undefined>;
    placement?: MaybeRefOrGetter<FloatingPlacement | undefined>;
    strategy?: MaybeRefOrGetter<Strategy | undefined>;
    offset?: MaybeRefOrGetter<number | undefined>;
    autoAdjustOverflow?: MaybeRefOrGetter<boolean | undefined>;
    shift?: MaybeRefOrGetter<boolean | undefined>;
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
export declare function useFloatingPosition(options: UseFloatingPositionOptions): UseFloatingPositionReturn;
export {};
