export type CascaderKey = string | number;
export type CascaderPath = CascaderKey[];
export type CascaderValue = CascaderPath | CascaderPath[] | undefined;
export interface CascaderOption {
    value: CascaderKey;
    label: string;
    disabled?: boolean;
    isLeaf?: boolean;
    children?: CascaderOption[];
}
