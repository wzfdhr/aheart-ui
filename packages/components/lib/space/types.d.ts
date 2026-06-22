import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type SpaceSize = AheartSize | number | [number, number];
export type SpaceDirection = 'horizontal' | 'vertical';
export type SpaceOrientation = SpaceDirection;
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
export declare const spaceProps: {
    readonly size: PropType<SpaceSize>;
    readonly direction: {
        readonly type: PropType<SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly orientation: PropType<SpaceDirection>;
    readonly vertical: BooleanConstructor;
    readonly align: PropType<SpaceAlign>;
    readonly wrap: BooleanConstructor;
    readonly separator: StringConstructor;
    readonly split: StringConstructor;
};
export type SpaceProps = ExtractPropTypes<typeof spaceProps>;
