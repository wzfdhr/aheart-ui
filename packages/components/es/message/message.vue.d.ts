declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly notices: {
        readonly type: import("vue").PropType<import("./types").MessageNotice[]>;
        readonly default: () => never[];
    };
    readonly top: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 8;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (key: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly notices: {
        readonly type: import("vue").PropType<import("./types").MessageNotice[]>;
        readonly default: () => never[];
    };
    readonly top: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 8;
    };
}>> & Readonly<{
    onClose?: ((key: string) => any) | undefined;
}>, {
    readonly top: string | number;
    readonly notices: import("./types").MessageNotice[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
