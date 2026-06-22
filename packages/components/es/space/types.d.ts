import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type SpaceSize = AheartSize | number | [number, number];
export type SpaceDirection = 'horizontal' | 'vertical';
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
export declare const spaceProps: {
    readonly size: PropType<SpaceSize>;
    readonly direction: {
        readonly type: PropType<SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly align: PropType<SpaceAlign>;
    readonly wrap: BooleanConstructor;
};
export type SpaceProps = ExtractPropTypes<typeof spaceProps>;
