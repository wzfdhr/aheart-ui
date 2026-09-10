import type { AIMessage, AIStreamEventV2 } from './types';
export type AIStreamDiagnosticKind = 'accepted' | 'duplicate' | 'buffered' | 'stale' | 'gap' | 'protocol-error' | 'terminal-no-op';
export interface AIStreamReducerState {
    requestId: string;
    messageId: string;
    cursor: {
        afterSequence: number;
        revision: number;
    };
    message: AIMessage;
    status: 'idle' | 'streaming' | 'reconnecting' | 'completed' | 'cancelled' | 'error';
    recoveryRequired: boolean;
    diagnostic: {
        kind: AIStreamDiagnosticKind;
        sequence?: number;
        reason?: string;
    };
}
export interface AIStreamReducerOptions {
    requestId: string;
    messageId: string;
    maxReconnectAttempts?: number;
    initialMessage?: AIMessage;
}
export interface AIStreamReducer {
    dispatch(event: AIStreamEventV2): AIStreamReducerState;
    reduce(event: AIStreamEventV2): AIStreamReducerState;
    recover(options?: {
        reason?: string;
    }): AIStreamReducerState;
    failRecovery(reason?: string, retryable?: boolean): AIStreamReducerState;
    getState(): AIStreamReducerState;
}
export declare const createAIStreamReducer: (options: AIStreamReducerOptions) => AIStreamReducer;
export declare const reduceAIStreamEvent: (state: AIStreamReducer, event: AIStreamEventV2) => AIStreamReducerState;
