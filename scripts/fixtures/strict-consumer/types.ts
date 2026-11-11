import AheartUI, { Button, Card, CardMeta, CardGrid } from 'aheart-ui'
import CardEntry, { ACardMeta, ACardGrid } from 'aheart-ui/es/card/index.js'
import AheartDnd, { SortableItem, SortableList } from '@aheart-ui/dnd'
import AheartAI, { AIChatPanel, AIForm } from '@aheart-ui/ai'
import type { App, VNodeChild } from 'vue'

export const components = [Button, Card, Card.Meta, Card.Grid, CardMeta, CardGrid, ACardMeta, ACardGrid, SortableItem, SortableList, AIChatPanel, AIForm]
declare const app: App
app.use(AheartUI).use(AheartDnd).use(AheartAI).use(Card).use(CardMeta).use(CardGrid)

const cardEntry: typeof Card = CardEntry
const meta: typeof CardMeta = Card.Meta
const grid: typeof CardGrid = Card.Grid
const metaAlias: typeof CardMeta = ACardMeta
const gridAlias: typeof CardGrid = ACardGrid
void [cardEntry, meta, grid, metaAlias, gridAlias]

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
export type CardExportTypes = [
  Assert<Equal<typeof CardEntry, typeof Card>>,
  Assert<Equal<typeof Card.Meta, typeof CardMeta>>,
  Assert<Equal<typeof Card.Grid, typeof CardGrid>>,
  Assert<Equal<typeof ACardMeta, typeof CardMeta>>,
  Assert<Equal<typeof ACardGrid, typeof CardGrid>>
]

type CardProps = InstanceType<typeof Card>['$props']
type MetaProps = InstanceType<typeof CardMeta>['$props']
type GridProps = InstanceType<typeof CardGrid>['$props']
const cardProps: CardProps = { variant: 'borderless', tabList: [{ key: 'one', tab: 'One' }], onTabChange: (key: string) => void key }
const metaProps: MetaProps = { title: 'Title', avatar: 'Avatar', description: 'Description', classNames: { title: 'title' } }
const gridProps: GridProps = { hoverable: false, styles: { root: { width: '50%' } } }
// @ts-expect-error Card variants remain constrained.
const invalidCard: CardProps = { variant: 'invalid' }
// @ts-expect-error CardMeta semantic parts remain constrained.
const invalidMeta: MetaProps = { classNames: { invalid: 'invalid' } }
// @ts-expect-error CardGrid hoverable remains boolean.
const invalidGrid: GridProps = { hoverable: 'yes' }
void [cardProps, metaProps, gridProps, invalidCard, invalidMeta, invalidGrid]

declare const cardSlots: InstanceType<typeof Card>['$slots']
declare const metaSlots: InstanceType<typeof CardMeta>['$slots']
declare const gridSlots: InstanceType<typeof CardGrid>['$slots']
const rendered: VNodeChild[] = [cardSlots.title?.({}), cardSlots.extra?.({}), cardSlots.cover?.({}), cardSlots.default?.({}), metaSlots.avatar?.({}), metaSlots.title?.({}), metaSlots.description?.({}), metaSlots.default?.({}), gridSlots.default?.({})]
// @ts-expect-error CardMeta has no arbitrary slot names.
metaSlots.missing({})
// @ts-expect-error CardGrid has no arbitrary slot names.
gridSlots.missing({})
void rendered

// M1 additive public entries must preserve root component and plugin types.
import SubpathButton, { Button as NamedButton, type ButtonProps } from 'aheart-ui/button'
import SubpathModal, { Modal as NamedModal, type ModalProps } from 'aheart-ui/modal'
import SubpathSelect, { Select as NamedSelect, type SelectProps } from 'aheart-ui/select'
import FullPlugin from 'aheart-ui/full'
import { Modal, Select } from 'aheart-ui'
export type M1ExportTypes = [
  Assert<Equal<typeof Button, typeof SubpathButton>>,
  Assert<Equal<typeof Button, typeof NamedButton>>,
  Assert<Equal<typeof Modal, typeof SubpathModal>>,
  Assert<Equal<typeof Modal, typeof NamedModal>>,
  Assert<Equal<typeof Select, typeof SubpathSelect>>,
  Assert<Equal<typeof Select, typeof NamedSelect>>,
  Assert<Equal<typeof AheartUI, typeof FullPlugin>>
]
app.use(FullPlugin).use(SubpathButton).use(SubpathModal).use(SubpathSelect)
const m1Props: [Partial<ButtonProps>, Partial<ModalProps>, Partial<SelectProps>] = [{}, {}, {}]
void m1Props

// Combobox's root aliases and logical entry share the same typed single-value API.
import { Combobox, ACombobox } from 'aheart-ui'
import SubpathCombobox, { Combobox as NamedCombobox, type ComboboxProps } from 'aheart-ui/combobox'
export type ComboboxExportTypes = [
  Assert<Equal<typeof Combobox, typeof ACombobox>>,
  Assert<Equal<typeof Combobox, typeof SubpathCombobox>>,
  Assert<Equal<typeof Combobox, typeof NamedCombobox>>
]
app.use(SubpathCombobox)
const comboboxProps: ComboboxProps = { options: [{ label: 'One', value: 1 }], modelValue: 1 }
const publicComboboxProps: InstanceType<typeof Combobox>['$props'] = {
  ...comboboxProps,
  'onUpdate:modelValue': (value) => { const selected: string | number | undefined = value; void selected }
}
// @ts-expect-error Combobox accepts one primitive selection.
const invalidCombobox: ComboboxProps = { options: [], modelValue: [1] }
void [publicComboboxProps, invalidCombobox]

import { AIChatPanel as ChatEntry, type AITransportV2 } from '@aheart-ui/ai/chat'
import { AIForm as AgentForm, type AIFormSchemaV1 } from '@aheart-ui/ai/agent'
import { AIAgentWorkbench } from '@aheart-ui/ai'
import { AIAgentWorkbench as Workbench } from '@aheart-ui/ai/workbench'
import { SortableList as SortableEntry, type SortableMoveEvent } from '@aheart-ui/dnd/sortable'
import { AheartUIResolver, type AheartUIResolverOptions } from 'aheart-ui/resolver'
export type M3ExportTypes = [
  Assert<Equal<typeof ChatEntry, typeof AIChatPanel>>,
  Assert<Equal<typeof AgentForm, typeof AIForm>>,
  Assert<Equal<typeof Workbench, typeof AIAgentWorkbench>>,
  Assert<Equal<typeof SortableEntry, typeof SortableList>>,
  AITransportV2, AIFormSchemaV1, SortableMoveEvent
]
const resolverOptions: AheartUIResolverOptions = { domains: ['base', 'ai', 'dnd'], importStyle: 'css' }
void AheartUIResolver(resolverOptions)('AAIAgentWorkbench')
