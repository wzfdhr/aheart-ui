import { type ComputedRef, type InjectionKey, type Ref } from 'vue';
export type AheartSize = 'large' | 'middle' | 'small';
export type AheartVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export interface AheartLocale {
    empty?: {
        description?: string;
    };
    pagination?: {
        ariaLabel?: string;
        prevPage?: string;
        nextPage?: string;
        pageSizeLabel?: string;
        pageSize?: (pageSize: number) => string;
        quickJumper?: string;
        goButton?: string;
        total?: (total: number, range: [number, number]) => string;
    };
    modal?: {
        okText?: string;
        cancelText?: string;
        close?: string;
    };
    table?: {
        emptyText?: string;
    };
}
export declare const zhCN: AheartLocale;
export declare const enUS: AheartLocale;
export interface AheartTheme {
    primaryColor?: string;
    primaryHoverColor?: string;
    successColor?: string;
    warningColor?: string;
    dangerColor?: string;
    infoColor?: string;
    textColor?: string;
    textSecondaryColor?: string;
    borderColor?: string;
    fillColor?: string;
    backgroundColor?: string;
    borderRadius?: string;
    fontSize?: string;
}
export interface AheartConfig {
    size?: AheartSize;
    disabled?: boolean;
    variant?: AheartVariant;
    locale?: AheartLocale;
    theme?: AheartTheme;
}
export declare const defaultAheartConfig: Required<Pick<AheartConfig, 'size' | 'disabled'>> & Pick<AheartConfig, 'locale' | 'theme'>;
export declare const aheartConfigKey: InjectionKey<ComputedRef<AheartConfig>>;
export declare const useAheartConfig: () => ComputedRef<AheartConfig>;
export declare const provideAheartConfig: (config: Ref<AheartConfig>) => ComputedRef<AheartConfig>;
export declare const resolveConfigValue: <T>(localValue: T | undefined, providerValue: T | undefined, fallback: T) => T;
