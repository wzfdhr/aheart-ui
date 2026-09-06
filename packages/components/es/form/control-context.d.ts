import { type AriaAttributes, type ComputedRef, type InjectionKey } from 'vue';
export interface FormControlContext {
    controlId: ComputedRef<string | undefined>;
    labelledBy: ComputedRef<string | undefined>;
    describedBy: ComputedRef<string | undefined>;
    invalid: ComputedRef<boolean>;
    status: ComputedRef<string | undefined>;
    change: () => void;
    blur: () => void;
}
export declare const formControlKey: InjectionKey<FormControlContext>;
export declare const useFormControl: () => {
    controlId: ComputedRef<string | undefined>;
    labelledBy: ComputedRef<string | undefined>;
    describedBy: ComputedRef<string | undefined>;
    invalid: ComputedRef<boolean>;
    status: ComputedRef<string | undefined>;
    change: () => void;
    blur: () => void;
} | undefined;
export declare const mergeAriaIds: (...values: Array<unknown>) => string | undefined;
export declare const formAriaInvalid: (explicit: unknown, status: string | undefined) => AriaAttributes['aria-invalid'];
