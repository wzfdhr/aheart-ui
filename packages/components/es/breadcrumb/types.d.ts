import type { ExtractPropTypes, PropType } from 'vue';
export interface BreadcrumbItem {
    title: string;
    href?: string;
    disabled?: boolean;
}
export declare const breadcrumbProps: {
    readonly items: PropType<BreadcrumbItem[]>;
    readonly separator: {
        readonly type: StringConstructor;
        readonly default: "/";
    };
};
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>;
