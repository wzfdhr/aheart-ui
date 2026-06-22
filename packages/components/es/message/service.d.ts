import type { MessageContent, MessageGlobalConfig, MessageKey } from './types';
export interface MessageHandle {
    key: MessageKey;
    close: () => void;
    then: Promise<void>['then'];
}
export declare const message: {
    open: (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => MessageHandle;
    success: (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => MessageHandle;
    info: (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => MessageHandle;
    warning: (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => MessageHandle;
    error: (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => MessageHandle;
    loading: (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => MessageHandle;
    destroy: (key?: MessageKey) => void;
    config: (options: MessageGlobalConfig) => void;
};
