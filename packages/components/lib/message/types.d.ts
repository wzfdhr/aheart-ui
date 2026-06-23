import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';
export type MessageKey = string | number;
export type MessageContentNode = VNodeChild;
export type MessageStackConfig = boolean | {
    threshold: number;
};
export type MessageSemanticPart = 'root' | 'notice' | 'icon' | 'content' | 'close';
export type MessageClassNames = Partial<Record<MessageSemanticPart, string>>;
export type MessageStyles = Partial<Record<MessageSemanticPart, StyleValue>>;
export interface MessageNotice {
    key: MessageKey;
    type: MessageType;
    content: MessageContentNode;
    duration?: number;
    className?: string;
    style?: StyleValue;
    icon?: MessageContentNode;
    closable?: boolean;
    closeIcon?: MessageContentNode;
    onClick?: () => void;
    onClose?: () => void;
    pauseOnHover?: boolean;
    classNames?: MessageClassNames;
    styles?: MessageStyles;
}
export interface MessageOpenConfig {
    key?: MessageKey;
    type?: MessageType;
    content: MessageContentNode;
    duration?: number;
    className?: string;
    style?: StyleValue;
    icon?: MessageContentNode;
    closable?: boolean;
    closeIcon?: MessageContentNode;
    onClick?: () => void;
    onClose?: () => void;
    pauseOnHover?: boolean;
    classNames?: MessageClassNames;
    styles?: MessageStyles;
}
export interface MessageGlobalConfig {
    top?: number | string;
    duration?: number;
    maxCount?: number;
    stack?: MessageStackConfig;
    getContainer?: () => HTMLElement;
    prefixCls?: string;
    rtl?: boolean;
    pauseOnHover?: boolean;
}
export type MessageContent = MessageContentNode | MessageOpenConfig;
export declare const messageProps: {
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
        readonly type: PropType<Partial<Record<MessageSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<MessageSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
    readonly stack: {
        readonly type: PropType<MessageStackConfig>;
        readonly default: false;
    };
};
export declare const messageEmits: {
    close: (key: MessageKey) => boolean;
    noticeMouseEnter: (key: MessageKey) => boolean;
    noticeMouseLeave: (key: MessageKey) => boolean;
};
export type MessageProps = ExtractPropTypes<typeof messageProps>;
