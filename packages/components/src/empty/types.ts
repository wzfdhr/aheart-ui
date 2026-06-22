import type { ExtractPropTypes } from 'vue'

export const emptyProps = {
  description: String
} as const

export type EmptyProps = ExtractPropTypes<typeof emptyProps>
