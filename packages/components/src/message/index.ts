import messageComponent from './message.vue'
import { withInstall } from '../utils/install'
import { message } from './service'

const Message = withInstall(messageComponent, 'AMessage')

export { message }
export default Message
export type { MessageHandle } from './service'
export type { MessageContent, MessageGlobalConfig, MessageNotice, MessageOpenConfig, MessageProps, MessageType } from './types'
