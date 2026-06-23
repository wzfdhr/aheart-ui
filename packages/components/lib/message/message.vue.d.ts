import { type PropType } from 'vue';
import type { MessageNotice, MessageStackConfig } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly notices: {
        readonly type: PropType<MessageNotice[]>;
        readonly default: () => never[];
    };
    readonly top: {
        readonly type: PropType<string | number>;
        readonly default: 8;
    };
    readonly prefixCls: StringConstructor;
    readonly rtl: BooleanConstructor;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").MessageSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").MessageSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
    readonly stack: {
        readonly type: PropType<MessageStackConfig>;
        readonly default: false;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (key: import("./types").MessageKey) => void;
    noticeMouseEnter: (key: import("./types").MessageKey) => void;
    noticeMouseLeave: (key: import("./types").MessageKey) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly notices: {
        readonly type: PropType<MessageNotice[]>;
        readonly default: () => never[];
    };
    readonly top: {
        readonly type: PropType<string | number>;
        readonly default: 8;
    };
    readonly prefixCls: StringConstructor;
    readonly rtl: BooleanConstructor;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").MessageSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").MessageSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
    readonly stack: {
        readonly type: PropType<MessageStackConfig>;
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
    readonly notices: MessageNotice[];
    readonly stack: MessageStackConfig;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
