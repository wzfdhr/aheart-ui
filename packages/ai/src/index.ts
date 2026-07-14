import AIChatPanel from './chat-panel.vue'
import AIActions from './actions.vue'
import AIAttachments from './attachments.vue'
import AIBubble from './bubble.vue'
import AIConversations from './conversations.vue'
import AIProcess from './process.vue'
import AIPrompts from './prompts.vue'
import AISender from './sender.vue'
import AISources from './sources.vue'
import AIThoughtChain from './thought-chain.vue'
import AIWelcome from './welcome.vue'
import './style.css'

export { AIActions, AIAttachments, AIBubble, AIChatPanel, AIConversations, AIProcess, AIPrompts, AISender, AISources, AIThoughtChain, AIWelcome }
export * from './types'

const AheartAI: Plugin = {
  install(app: App) {
    app.component('AAIActions', AIActions)
    app.component('AAIAttachments', AIAttachments)
    app.component('AAIBubble', AIBubble)
    app.component('AAIChatPanel', AIChatPanel)
    app.component('AAIConversations', AIConversations)
    app.component('AAIProcess', AIProcess)
    app.component('AAIPrompts', AIPrompts)
    app.component('AAISender', AISender)
    app.component('AAISources', AISources)
    app.component('AAIThoughtChain', AIThoughtChain)
    app.component('AAIWelcome', AIWelcome)
  }
}

export default AheartAI
import type { App, Plugin } from 'vue'
