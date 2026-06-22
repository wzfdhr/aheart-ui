import { type ComputedRef, type InjectionKey, type Ref } from 'vue';
export type AheartSize = 'large' | 'middle' | 'small';
export interface AheartLocale {
    empty?: {
        description?: string;
    };
}
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
    locale?: AheartLocale;
    theme?: AheartTheme;
}
export declare const defaultAheartConfig: Required<Pick<AheartConfig, 'size' | 'disabled'>> & Pick<AheartConfig, 'locale' | 'theme'>;
export declare const aheartConfigKey: InjectionKey<ComputedRef<AheartConfig>>;
export declare const useAheartConfig: () => ComputedRef<AheartConfig>;
export declare const provideAheartConfig: (config: Ref<AheartConfig>) => ComputedRef<AheartConfig>;
export declare const resolveConfigValue: <T>(localValue: T | undefined, providerValue: T | undefined, fallback: T) => T;
