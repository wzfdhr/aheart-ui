import { createApp, h } from 'vue'
import ASelect from 'aheart-ui/es/select/select.vue.js'
import 'aheart-ui/style.css'
createApp({render:()=>h(ASelect,{options:[{label:'Baseline',value:1}],defaultValue:1})}).mount('#app')
