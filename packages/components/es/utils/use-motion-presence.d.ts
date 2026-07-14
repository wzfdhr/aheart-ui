import { type MaybeRefOrGetter } from 'vue';
export type MotionPresencePhase = 'hidden' | 'enter' | 'entered' | 'leave';
interface MotionPresenceOptions {
    forceRender?: MaybeRefOrGetter<boolean | undefined>;
    destroyOnHidden?: MaybeRefOrGetter<boolean>;
    duration: number;
}
export declare function useMotionPresence(visible: MaybeRefOrGetter<boolean>, options: MotionPresenceOptions): {
    isMounted: import("vue").ComputedRef<boolean>;
    phase: import("vue").Ref<MotionPresencePhase, MotionPresencePhase>;
};
export {};
