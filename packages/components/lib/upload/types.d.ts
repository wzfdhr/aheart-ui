export type UploadStatus = 'ready' | 'uploading' | 'done' | 'error' | 'cancelled';
export type UploadFailureReason = 'validation' | 'timeout' | 'request' | 'cancelled';
export interface UploadFile {
    uid: string;
    name: string;
    size?: number;
    type?: string;
    status?: UploadStatus;
    percent?: number;
    originFile?: File;
    response?: unknown;
    error?: unknown;
    failureReason?: UploadFailureReason;
}
export interface UploadRequestOption {
    file: UploadFile;
    signal: AbortSignal;
    taskId: string;
    onProgress: (percent: number) => void;
    onSuccess: (response?: unknown) => void;
    onError: (error: unknown) => void;
    onCancel: () => void;
}
export interface UploadRequestHandle {
    abort?: () => void;
}
export type UploadRequestResult = void | UploadRequestHandle;
export type UploadRequest = (options: UploadRequestOption) => UploadRequestResult | Promise<UploadRequestResult>;
