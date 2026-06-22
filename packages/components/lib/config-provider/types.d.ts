import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartLocale, AheartSize, AheartTheme } from '../config';
export declare const configProviderProps: {
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly locale: PropType<AheartLocale>;
    readonly theme: PropType<AheartTheme>;
};
export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;
