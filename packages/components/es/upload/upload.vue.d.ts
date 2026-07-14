import type { UploadFile, UploadRequest } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    fileList?: UploadFile[] | undefined;
    defaultFileList?: UploadFile[] | undefined;
    beforeUpload?: ((file: File, fileList: UploadFile[]) => boolean | Promise<boolean>) | undefined;
    customRequest?: UploadRequest | undefined;
    maxCount?: number | undefined;
    disabled?: boolean | undefined;
    multiple?: boolean | undefined;
}>, {
    defaultFileList: () => never[];
    maxCount: number;
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    remove: (file: UploadFile) => void;
    change: (files: UploadFile[]) => void;
    "update:fileList": (files: UploadFile[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    fileList?: UploadFile[] | undefined;
    defaultFileList?: UploadFile[] | undefined;
    beforeUpload?: ((file: File, fileList: UploadFile[]) => boolean | Promise<boolean>) | undefined;
    customRequest?: UploadRequest | undefined;
    maxCount?: number | undefined;
    disabled?: boolean | undefined;
    multiple?: boolean | undefined;
}>, {
    defaultFileList: () => never[];
    maxCount: number;
}>>> & Readonly<{
    onRemove?: ((file: UploadFile) => any) | undefined;
    onChange?: ((files: UploadFile[]) => any) | undefined;
    "onUpdate:fileList"?: ((files: UploadFile[]) => any) | undefined;
}>, {
    maxCount: number;
    defaultFileList: UploadFile[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
