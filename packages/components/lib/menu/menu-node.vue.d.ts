import type { MenuClickInfo, MenuItem, MenuMode } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    item: MenuItem;
    level?: number | undefined;
    selectedKeys: string[];
    openKeys: string[];
    disabled?: boolean | undefined;
    mode?: MenuMode | undefined;
    keyPath?: string[] | undefined;
}>, {
    level: number;
    disabled: boolean;
    mode: string;
    keyPath: () => never[];
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    itemClick: (info: MenuClickInfo) => void;
    submenuToggle: (key: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    item: MenuItem;
    level?: number | undefined;
    selectedKeys: string[];
    openKeys: string[];
    disabled?: boolean | undefined;
    mode?: MenuMode | undefined;
    keyPath?: string[] | undefined;
}>, {
    level: number;
    disabled: boolean;
    mode: string;
    keyPath: () => never[];
}>>> & Readonly<{
    onItemClick?: ((info: MenuClickInfo) => any) | undefined;
    onSubmenuToggle?: ((key: string) => any) | undefined;
}>, {
    disabled: boolean;
    mode: MenuMode;
    level: number;
    keyPath: string[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
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
