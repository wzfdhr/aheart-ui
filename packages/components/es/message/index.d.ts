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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export { message };
export default Message;
export type { MessageContent, MessageGlobalConfig, MessageNotice, MessageOpenConfig, MessageProps, MessageType } from './types';
