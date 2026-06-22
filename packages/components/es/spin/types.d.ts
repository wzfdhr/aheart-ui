import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export declare const spinProps: {
    readonly spinning: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly size: {
        readonly type: PropType<AheartSize>;
        readonly default: "middle";
    };
    readonly tip: StringConstructor;
};
export type SpinProps = ExtractPropTypes<typeof spinProps>;
