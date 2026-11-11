export type ComboboxValue = string | number;
export interface ComboboxOption {
    value: ComboboxValue;
    label: string;
    disabled?: boolean;
}
export interface ComboboxProps {
    id?: string;
    modelValue?: ComboboxValue;
    defaultValue?: ComboboxValue;
    options: readonly ComboboxOption[];
    placeholder?: string;
    disabled?: boolean;
    getPopupContainer?: (trigger: HTMLElement) => HTMLElement | false;
}
