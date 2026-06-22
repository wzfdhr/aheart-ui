import { type PropType, type VNodeChild } from 'vue';
import { type BreadcrumbItem } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly items: PropType<BreadcrumbItem[]>;
    readonly params: {
        readonly type: PropType<import("./types").BreadcrumbParams>;
        readonly default: () => {};
    };
    readonly separator: {
        readonly type: PropType<VNodeChild>;
        readonly default: "/";
    };
    readonly itemRender: PropType<import("./types").BreadcrumbItemRender>;
    readonly className: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly items: PropType<BreadcrumbItem[]>;
    readonly params: {
        readonly type: PropType<import("./types").BreadcrumbParams>;
        readonly default: () => {};
    };
    readonly separator: {
        readonly type: PropType<VNodeChild>;
        readonly default: "/";
    };
    readonly itemRender: PropType<import("./types").BreadcrumbItemRender>;
    readonly className: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{}>, {
    readonly classNames: Partial<Record<import("./types").BreadcrumbSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").BreadcrumbSemanticPart, import("vue").StyleValue>>;
    readonly separator: VNodeChild;
    readonly params: import("./types").BreadcrumbParams;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
