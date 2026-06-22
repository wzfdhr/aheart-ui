import card from './card.vue'
import cardMeta from './meta.vue'
import { withInstall, type SFCWithInstall } from '../utils/install'

export const CardMeta = withInstall(cardMeta, 'ACardMeta')

type CardComponent = SFCWithInstall<typeof card> & {
  Meta: typeof CardMeta
}

const Card = withInstall(card, 'ACard') as CardComponent
Card.Meta = CardMeta

export { CardMeta as ACardMeta }
export type {
  CardAction,
  CardClassNames,
  CardMetaClassNames,
  CardMetaProps,
  CardMetaSemanticPart,
  CardMetaStyles,
  CardProps,
  CardSemanticPart,
  CardStyles,
  CardType,
  CardVariant
} from './types'
export default Card
