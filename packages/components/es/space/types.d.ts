import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export type SpaceSize = AheartSize | number | [number, number];
export type SpaceDirection = 'horizontal' | 'vertical';
export type SpaceOrientation = SpaceDirection;
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';
export type SpaceSeparator = VNodeChild;
export type SpaceSemanticPart = 'root' | 'item' | 'separator';
export type SpaceSemanticClassNames = Partial<Record<SpaceSemanticPart, string>>;
export type SpaceSemanticStyles = Partial<Record<SpaceSemanticPart, StyleValue>>;
export interface SpaceSemanticInfo {
    props: {
        size?: SpaceSize;
        direction?: SpaceDirection;
        orientation?: SpaceOrientation;
        vertical?: boolean;
        align?: SpaceAlign;
        wrap?: boolean;
        separator?: SpaceSeparator;
        split?: SpaceSeparator;
    };
}
export type SpaceClassNames = SpaceSemanticClassNames | ((info: SpaceSemanticInfo) => SpaceSemanticClassNames);
export type SpaceStyles = SpaceSemanticStyles | ((info: SpaceSemanticInfo) => SpaceSemanticStyles);
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
    readonly separator: PropType<VNodeChild>;
    readonly split: PropType<VNodeChild>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<SpaceClassNames>;
    readonly styles: PropType<SpaceStyles>;
};
export type SpaceProps = ExtractPropTypes<typeof spaceProps>;
