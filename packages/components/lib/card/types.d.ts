import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export declare const cardProps: {
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly hoverable: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: PropType<AheartSize>;
};
export type CardProps = ExtractPropTypes<typeof cardProps>;
