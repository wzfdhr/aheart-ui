import type { CascaderVirtual, CascaderVirtualConfig } from '../index'
import type { CascaderVirtual as RootCascaderVirtual, CascaderVirtualConfig as RootCascaderVirtualConfig } from '../../index'

const defaults: CascaderVirtualConfig = {
  height: 256,
  estimateSize: 32,
  overscan: 4
}
const empty: CascaderVirtual = {}
const enabled: CascaderVirtual = true
const disabled: CascaderVirtual = false
const rootDefaults: RootCascaderVirtualConfig = defaults
const rootEmpty: RootCascaderVirtual = empty
const rootEnabled: RootCascaderVirtual = enabled
const rootDisabled: RootCascaderVirtual = disabled

void defaults
void empty
void enabled
void disabled
void rootDefaults
void rootEmpty
void rootEnabled
void rootDisabled
