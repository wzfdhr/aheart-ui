import type { TreeSelectVirtual, TreeSelectVirtualConfig } from '../../index'

const configured: TreeSelectVirtualConfig = { height: 256, estimateSize: 28, overscan: 4 }
const values: TreeSelectVirtual[] = [true, {}, configured]

void values
