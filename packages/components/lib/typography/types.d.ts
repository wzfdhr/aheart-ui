import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger';
export type TitleLevel = 1 | 2 | 3 | 4 | 5;
export type TypographySemanticPart = 'root';
export type TypographySemanticClassNames = Partial<Record<TypographySemanticPart, string>>;
export type TypographySemanticStyles = Partial<Record<TypographySemanticPart, StyleValue>>;
export interface TypographySemanticInfo {
    props: Record<string, unknown>;
}
export type TypographyClassNames = TypographySemanticClassNames | ((info: TypographySemanticInfo) => TypographySemanticClassNames);
export type TypographyStyles = TypographySemanticStyles | ((info: TypographySemanticInfo) => TypographySemanticStyles);
export interface TypographyEllipsisConfig {
    rows?: number;
}
export type TypographyEllipsis = boolean | TypographyEllipsisConfig;
export type TypographyCopyableIcon = VNodeChild | [VNodeChild, VNodeChild];
export type TypographyCopyableTooltip = false | [VNodeChild, VNodeChild];
export interface TypographyCopyableConfig {
    text?: string | (() => string | Promise<string>);
    icon?: TypographyCopyableIcon;
    tooltips?: TypographyCopyableTooltip;
    format?: 'text/plain' | 'text/html';
    tabIndex?: number;
    onCopy?: (event: MouseEvent) => void;
}
export type TypographyCopyable = boolean | TypographyCopyableConfig;
export type TypographyActionPlacement = 'start' | 'end';
export interface TypographyActionsConfig {
    placement?: TypographyActionPlacement;
}
export declare const typographyProps: {
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<TypographyClassNames>;
    readonly styles: PropType<TypographyStyles>;
};
export declare const titleProps: {
    readonly level: {
        readonly type: PropType<TitleLevel>;
        readonly default: 1;
        readonly validator: (value: number) => boolean;
    };
    readonly type: PropType<TypographyType>;
    readonly disabled: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly copyable: PropType<TypographyCopyable>;
    readonly actions: PropType<TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<TypographyClassNames>;
    readonly styles: PropType<TypographyStyles>;
};
export declare const textProps: {
    readonly type: PropType<TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly code: BooleanConstructor;
    readonly keyboard: BooleanConstructor;
    readonly delete: BooleanConstructor;
    readonly underline: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly disabled: BooleanConstructor;
    readonly copyable: PropType<TypographyCopyable>;
    readonly actions: PropType<TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<TypographyClassNames>;
    readonly styles: PropType<TypographyStyles>;
};
export declare const paragraphProps: {
    readonly type: PropType<TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly ellipsis: PropType<TypographyEllipsis>;
    readonly mark: BooleanConstructor;
    readonly disabled: BooleanConstructor;
    readonly copyable: PropType<TypographyCopyable>;
    readonly actions: PropType<TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<TypographyClassNames>;
    readonly styles: PropType<TypographyStyles>;
};
export declare const linkProps: {
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly disabled: BooleanConstructor;
    readonly underline: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<TypographyClassNames>;
    readonly styles: PropType<TypographyStyles>;
};
export type TypographyProps = ExtractPropTypes<typeof typographyProps>;
export type TitleProps = ExtractPropTypes<typeof titleProps>;
export type TextProps = ExtractPropTypes<typeof textProps>;
export type ParagraphProps = ExtractPropTypes<typeof paragraphProps>;
export type LinkProps = ExtractPropTypes<typeof linkProps>;
