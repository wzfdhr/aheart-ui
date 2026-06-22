import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export declare const cardVariants: readonly ["outlined", "borderless"];
export declare const cardTypes: readonly ["inner"];
export type CardVariant = (typeof cardVariants)[number];
export type CardType = (typeof cardTypes)[number];
export type CardAction = string | number;
export type CardSemanticPart = 'root' | 'header' | 'title' | 'extra' | 'cover' | 'body' | 'actions';
export type CardClassNames = Partial<Record<CardSemanticPart, string>>;
export type CardStyles = Partial<Record<CardSemanticPart, StyleValue>>;
export declare const cardProps: {
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: PropType<"outlined" | "borderless">;
        readonly validator: (value: string) => boolean;
    };
    readonly type: {
        readonly type: PropType<"inner">;
        readonly validator: (value: string) => boolean;
    };
    readonly hoverable: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: PropType<AheartSize>;
    readonly actions: PropType<CardAction[]>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly headStyle: PropType<StyleValue>;
    readonly bodyStyle: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<CardSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<CardSemanticPart, StyleValue>>>;
};
export type CardProps = ExtractPropTypes<typeof cardProps>;
