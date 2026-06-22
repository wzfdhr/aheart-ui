import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type BreadcrumbParams = Record<string, string | number>;
export type BreadcrumbSemanticPart = 'root' | 'list' | 'item' | 'link' | 'text' | 'separator';
export type BreadcrumbClassNames = Partial<Record<BreadcrumbSemanticPart, string>>;
export type BreadcrumbStyles = Partial<Record<BreadcrumbSemanticPart, StyleValue>>;
export interface BreadcrumbRouteItem {
    key?: string | number;
    type?: 'item';
    title: VNodeChild;
    href?: string;
    path?: string;
    className?: string;
    style?: StyleValue;
    disabled?: boolean;
    onClick?: (event: MouseEvent, item: BreadcrumbRouteItem, index: number) => void;
}
export interface BreadcrumbSeparatorItem {
    key?: string | number;
    type: 'separator';
    separator?: VNodeChild;
    className?: string;
    style?: StyleValue;
}
export type BreadcrumbItem = BreadcrumbRouteItem | BreadcrumbSeparatorItem;
export type BreadcrumbItemRender = (item: BreadcrumbRouteItem, params: BreadcrumbParams, items: BreadcrumbItem[], paths: string[], index: number) => VNodeChild;
export declare const breadcrumbProps: {
    readonly items: PropType<BreadcrumbItem[]>;
    readonly params: {
        readonly type: PropType<BreadcrumbParams>;
        readonly default: () => {};
    };
    readonly separator: {
        readonly type: PropType<VNodeChild>;
        readonly default: "/";
    };
    readonly itemRender: PropType<BreadcrumbItemRender>;
    readonly className: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<BreadcrumbSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<BreadcrumbSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>;
