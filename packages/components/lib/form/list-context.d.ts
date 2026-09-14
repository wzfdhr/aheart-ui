import type { ComputedRef, InjectionKey } from 'vue';
import type { FormNamePath } from './types';
export interface FormListNameContext {
    prefix: ComputedRef<FormNamePath>;
    resolveName: (name: FormNamePath) => FormNamePath;
    resolveOwner: (name: FormNamePath) => string;
}
export declare const formListNameContextKey: InjectionKey<FormListNameContext>;
