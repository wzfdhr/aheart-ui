declare const Breadcrumb: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<import("./types").BreadcrumbItem[]>;
    readonly params: {
        readonly type: import("vue").PropType<import("./types").BreadcrumbParams>;
        readonly default: () => {};
    };
    readonly separator: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: "/";
    };
    readonly itemRender: import("vue").PropType<import("./types").BreadcrumbItemRender>;
    readonly className: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<import("./types").BreadcrumbItem[]>;
    readonly params: {
        readonly type: import("vue").PropType<import("./types").BreadcrumbParams>;
        readonly default: () => {};
    };
    readonly separator: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: "/";
    };
    readonly itemRender: import("vue").PropType<import("./types").BreadcrumbItemRender>;
    readonly className: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").BreadcrumbSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{}>, {
    readonly classNames: Partial<Record<import("./types").BreadcrumbSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").BreadcrumbSemanticPart, import("vue").StyleValue>>;
    readonly separator: import("vue").VNodeChild;
    readonly params: import("./types").BreadcrumbParams;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Breadcrumb;
