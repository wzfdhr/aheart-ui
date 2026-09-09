export interface PickerTransactionOptions<T> {
    needConfirm: boolean | (() => boolean);
    committed?: T;
}
export interface PickerActionGate {
    disabled?: boolean;
    readOnly?: boolean;
}
export interface PickerTransaction<T> {
    isConfirmRequired(): boolean;
    shouldCommit(): boolean;
    shouldStage(): boolean;
    begin(value: T): T;
    apply(value: T): T;
    commit(): T | undefined;
    discard(): T | undefined;
    syncCommitted(value: T | undefined): void;
    canAct(gate?: PickerActionGate): boolean;
    snapshot(): {
        committed?: T;
        draft?: T;
    };
}
export declare const createPickerTransaction: <T>({ needConfirm, committed }: PickerTransactionOptions<T>) => PickerTransaction<T>;
