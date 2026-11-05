const a = require('aheart-ui'), d = require('@aheart-ui/dnd'), i = require('@aheart-ui/ai')
if (!a.Button || !d.SortableList || !i.AIChatPanel) throw new Error('CJS exports missing')
console.log('CJS ok', Object.keys(a).length, Object.keys(d).length, Object.keys(i).length)
