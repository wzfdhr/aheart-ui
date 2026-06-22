import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type DescriptionsLayout = 'horizontal' | 'vertical';
export interface DescriptionItem {
    label: string;
    content: string;
    span?: number;
}
export declare const descriptionsProps: {
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly items: PropType<DescriptionItem[]>;
    readonly bordered: BooleanConstructor;
    readonly column: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly layout: {
        readonly type: PropType<DescriptionsLayout>;
        readonly default: "horizontal";
    };
    readonly size: PropType<AheartSize>;
};
export type DescriptionsProps = ExtractPropTypes<typeof descriptionsProps>;
