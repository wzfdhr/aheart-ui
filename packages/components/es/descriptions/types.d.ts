import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export type DescriptionsLayout = 'horizontal' | 'vertical';
export type DescriptionItemSpan = number | 'filled';
export type DescriptionsSemanticPart = 'root' | 'header' | 'title' | 'extra' | 'table' | 'row' | 'item' | 'label' | 'content';
export type DescriptionsClassNames = Partial<Record<DescriptionsSemanticPart, string>>;
export type DescriptionsStyles = Partial<Record<DescriptionsSemanticPart, StyleValue>>;
export interface DescriptionItem {
    key?: string | number;
    label: string;
    content?: string | number;
    children?: string | number;
    span?: DescriptionItemSpan;
    className?: string;
    style?: StyleValue;
    labelStyle?: StyleValue;
    contentStyle?: StyleValue;
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
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly labelStyle: PropType<StyleValue>;
    readonly contentStyle: PropType<StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<DescriptionsSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<DescriptionsSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export type DescriptionsProps = ExtractPropTypes<typeof descriptionsProps>;
