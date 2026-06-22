import type { ExtractPropTypes, PropType } from 'vue';
export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';
export interface MessageNotice {
    key: string;
    type: MessageType;
    content: string;
    duration?: number;
    onClose?: () => void;
}
export interface MessageOpenConfig {
    key?: string;
    type?: MessageType;
    content: string;
    duration?: number;
    onClose?: () => void;
}
export interface MessageGlobalConfig {
    top?: number | string;
    duration?: number;
    maxCount?: number;
}
export type MessageContent = string | MessageOpenConfig;
export declare const messageProps: {
    readonly notices: {
        readonly type: PropType<MessageNotice[]>;
        readonly default: () => never[];
    };
    readonly top: {
        readonly type: PropType<string | number>;
        readonly default: 8;
    };
};
export declare const messageEmits: {
    close: (key: string) => boolean;
};
export type MessageProps = ExtractPropTypes<typeof messageProps>;
