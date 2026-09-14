import type { InjectionKey } from 'vue';
import type { FormFieldState, FormMessageVariables, FormNamePath, FormRule, FormValidateFirst } from './types';
export interface FormListReconcileResult {
    oldIndexToNewIndex: ReadonlyMap<number, number>;
}
export interface FormListController {
    name: FormNamePath;
    owner: string;
    reconcile: (items: readonly unknown[]) => FormListReconcileResult | undefined;
    reset: (items: readonly unknown[]) => void;
}
export interface FormInternalContext {
    registerOwnedField: (name: FormNamePath, owner: string, rules: FormRule[], validateFirst: FormValidateFirst, messageVariables: FormMessageVariables, options?: {
        dependencies?: FormNamePath[];
        validateTrigger?: FormFieldState['validateTrigger'];
        preserve?: boolean;
    }) => void;
    unregisterOwnedField: (name: FormNamePath, owner: string) => void;
    getFieldErrors: (name: FormNamePath) => string[];
    isFieldValidating: (name: FormNamePath) => boolean;
    isFieldRequired: (name: FormNamePath) => boolean;
    onOwnedFieldChange: (name: FormNamePath, owner: string) => void;
    onOwnedFieldBlur: (name: FormNamePath, owner: string) => void;
    initializeList: (name: FormNamePath, initialValue: readonly unknown[] | undefined) => readonly unknown[] | undefined;
    getValue: (name: FormNamePath) => unknown;
    registerList: (controller: FormListController) => boolean;
    unregisterList: (name: FormNamePath, owner: string) => void;
    mutateList: (name: FormNamePath, owner: string, oldIndexToNewIndex: ReadonlyMap<number, number>, mutation: (items: unknown[]) => void) => boolean;
}
export declare const formInternalContextKey: InjectionKey<FormInternalContext>;
