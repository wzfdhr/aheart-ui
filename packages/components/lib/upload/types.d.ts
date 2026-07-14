export type UploadStatus = 'ready' | 'uploading' | 'done' | 'error';
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
}
export interface UploadRequestOption {
    file: UploadFile;
    onProgress: (percent: number) => void;
    onSuccess: (response?: unknown) => void;
    onError: (error: unknown) => void;
}
export type UploadRequest = (options: UploadRequestOption) => void | Promise<void>;
