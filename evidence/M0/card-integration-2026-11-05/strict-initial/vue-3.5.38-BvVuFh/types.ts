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
