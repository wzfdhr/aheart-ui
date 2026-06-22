import type { ExtractPropTypes, PropType } from 'vue';
export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger';
export type TitleLevel = 1 | 2 | 3 | 4 | 5;
export declare const typographyProps: {};
export declare const titleProps: {
    readonly level: {
        readonly type: PropType<TitleLevel>;
        readonly default: 1;
        readonly validator: (value: number) => boolean;
    };
};
export declare const textProps: {
    readonly type: PropType<TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly code: BooleanConstructor;
    readonly keyboard: BooleanConstructor;
    readonly delete: BooleanConstructor;
    readonly underline: BooleanConstructor;
    readonly disabled: BooleanConstructor;
};
export declare const paragraphProps: {
    readonly type: PropType<TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly ellipsis: BooleanConstructor;
    readonly disabled: BooleanConstructor;
};
export declare const linkProps: {
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly disabled: BooleanConstructor;
    readonly underline: BooleanConstructor;
};
export type TypographyProps = ExtractPropTypes<typeof typographyProps>;
export type TitleProps = ExtractPropTypes<typeof titleProps>;
export type TextProps = ExtractPropTypes<typeof textProps>;
export type ParagraphProps = ExtractPropTypes<typeof paragraphProps>;
export type LinkProps = ExtractPropTypes<typeof linkProps>;
