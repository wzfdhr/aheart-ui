export type SplitterSize = number | `${number}%` | 'auto'

export interface SplitterPanelConstraint {
  min?: number | `${number}%`
  max?: number | `${number}%`
}

export interface ResolveSplitterSizesOptions {
  containerSize: number
  sizes: SplitterSize[]
  panels: SplitterPanelConstraint[]
}

export interface ResizeAdjacentPanelsOptions {
  sizes: number[]
  panels: SplitterPanelConstraint[]
  handleIndex: number
  delta: number
}
