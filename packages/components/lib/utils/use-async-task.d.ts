export type AsyncTaskStatus = 'idle' | 'pending' | 'success' | 'error';
export interface AsyncTaskContext {
    signal: AbortSignal;
    requestId: number;
}
export interface AsyncTaskOptions<TResult> {
    onSuccess?: (result: TResult) => void;
    onError?: (error: unknown) => void;
}
export declare const useAsyncTask: <TArgs extends unknown[], TResult>(task: (context: AsyncTaskContext, ...args: TArgs) => Promise<TResult>, options?: AsyncTaskOptions<TResult>) => {
    status: Readonly<import("vue").Ref<AsyncTaskStatus, AsyncTaskStatus>>;
    data: Readonly<import("vue").Ref<import("vue").DeepReadonly<TResult> | undefined, import("vue").DeepReadonly<TResult> | undefined>>;
    error: Readonly<import("vue").Ref<Readonly<unknown>, Readonly<unknown>>>;
    isPending: import("vue").ComputedRef<boolean>;
    run: (...args: TArgs) => Promise<TResult | undefined>;
    abort: () => void;
    reset: () => void;
};
