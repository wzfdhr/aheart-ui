export type CascaderKey = string | number
export type CascaderPath = CascaderKey[]
export type CascaderValue = CascaderPath | CascaderPath[] | undefined
export interface CascaderLoadContext { signal: AbortSignal }
export interface CascaderVirtualConfig { height?: number; estimateSize?: number; overscan?: number }
export type CascaderVirtual = boolean | CascaderVirtualConfig

export interface CascaderOption {
  value: CascaderKey
  label: string
  disabled?: boolean
  isLeaf?: boolean
  children?: CascaderOption[]
}
