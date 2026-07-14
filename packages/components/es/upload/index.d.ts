export type { UploadFile, UploadRequest, UploadRequestOption, UploadStatus } from './types';
declare const _default: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        multiple: {
            type: import("vue").PropType<boolean>;
        };
        disabled: {
            type: import("vue").PropType<boolean>;
        };
        maxCount: {
            type: import("vue").PropType<number>;
            default: number;
        };
        fileList: {
            type: import("vue").PropType<import("./types").UploadFile[]>;
        };
        defaultFileList: {
            type: import("vue").PropType<import("./types").UploadFile[]>;
            default: () => never[];
        };
        beforeUpload: {
            type: import("vue").PropType<(file: File, fileList: import("./types").UploadFile[]) => boolean | Promise<boolean>>;
        };
        customRequest: {
            type: import("vue").PropType<import("./types").UploadRequest>;
        };
    }>> & Readonly<{
        onRemove?: ((file: import("./types").UploadFile) => any) | undefined;
        onChange?: ((files: import("./types").UploadFile[]) => any) | undefined;
        "onUpdate:fileList"?: ((files: import("./types").UploadFile[]) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        remove: (file: import("./types").UploadFile) => void;
        change: (files: import("./types").UploadFile[]) => void;
        "update:fileList": (files: import("./types").UploadFile[]) => void;
    }, import("vue").PublicProps, {
        maxCount: number;
        defaultFileList: import("./types").UploadFile[];
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        multiple: {
            type: import("vue").PropType<boolean>;
        };
        disabled: {
            type: import("vue").PropType<boolean>;
        };
        maxCount: {
            type: import("vue").PropType<number>;
            default: number;
        };
        fileList: {
            type: import("vue").PropType<import("./types").UploadFile[]>;
        };
        defaultFileList: {
            type: import("vue").PropType<import("./types").UploadFile[]>;
            default: () => never[];
        };
        beforeUpload: {
            type: import("vue").PropType<(file: File, fileList: import("./types").UploadFile[]) => boolean | Promise<boolean>>;
        };
        customRequest: {
            type: import("vue").PropType<import("./types").UploadRequest>;
        };
    }>> & Readonly<{
        onRemove?: ((file: import("./types").UploadFile) => any) | undefined;
        onChange?: ((files: import("./types").UploadFile[]) => any) | undefined;
        "onUpdate:fileList"?: ((files: import("./types").UploadFile[]) => any) | undefined;
    }>, {}, {}, {}, {}, {
        maxCount: number;
        defaultFileList: import("./types").UploadFile[];
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    multiple: {
        type: import("vue").PropType<boolean>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    maxCount: {
        type: import("vue").PropType<number>;
        default: number;
    };
    fileList: {
        type: import("vue").PropType<import("./types").UploadFile[]>;
    };
    defaultFileList: {
        type: import("vue").PropType<import("./types").UploadFile[]>;
        default: () => never[];
    };
    beforeUpload: {
        type: import("vue").PropType<(file: File, fileList: import("./types").UploadFile[]) => boolean | Promise<boolean>>;
    };
    customRequest: {
        type: import("vue").PropType<import("./types").UploadRequest>;
    };
}>> & Readonly<{
    onRemove?: ((file: import("./types").UploadFile) => any) | undefined;
    onChange?: ((files: import("./types").UploadFile[]) => any) | undefined;
    "onUpdate:fileList"?: ((files: import("./types").UploadFile[]) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    remove: (file: import("./types").UploadFile) => void;
    change: (files: import("./types").UploadFile[]) => void;
    "update:fileList": (files: import("./types").UploadFile[]) => void;
}, string, {
    maxCount: number;
    defaultFileList: import("./types").UploadFile[];
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default _default;
