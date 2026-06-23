import { message } from './service';
declare const Message: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly notices: {
        readonly type: import("vue").PropType<import("./types").MessageNotice[]>;
        readonly default: () => never[];
    };
    readonly top: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 8;
    };
    readonly prefixCls: StringConstructor;
    readonly rtl: BooleanConstructor;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MessageSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MessageSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
    readonly stack: {
        readonly type: import("vue").PropType<import("./types").MessageStackConfig>;
        readonly default: false;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (key: import("./types").MessageKey) => void;
    noticeMouseEnter: (key: import("./types").MessageKey) => void;
    noticeMouseLeave: (key: import("./types").MessageKey) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly notices: {
        readonly type: import("vue").PropType<import("./types").MessageNotice[]>;
        readonly default: () => never[];
    };
    readonly top: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 8;
    };
    readonly prefixCls: StringConstructor;
    readonly rtl: BooleanConstructor;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MessageSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MessageSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
    readonly stack: {
        readonly type: import("vue").PropType<import("./types").MessageStackConfig>;
        readonly default: false;
    };
}>> & Readonly<{
    onClose?: ((key: import("./types").MessageKey) => any) | undefined;
    onNoticeMouseEnter?: ((key: import("./types").MessageKey) => any) | undefined;
    onNoticeMouseLeave?: ((key: import("./types").MessageKey) => any) | undefined;
}>, {
    readonly classNames: Partial<Record<import("./types").MessageSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").MessageSemanticPart, import("vue").StyleValue>>;
    readonly top: string | number;
    readonly rtl: boolean;
    readonly notices: import("./types").MessageNotice[];
    readonly stack: import("./types").MessageStackConfig;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export { message };
export default Message;
export type { MessageHandle } from './service';
export type { MessageContent, MessageGlobalConfig, MessageNotice, MessageOpenConfig, MessageProps, MessageType } from './types';
