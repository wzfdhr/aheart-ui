import button from './button.vue'
import type {App,Plugin} from "vue"
type SFCWithInstall<T> = T&Plugin
const withInstall = <T>(comp:T) => {
    (comp as SFCWithInstall<T>).install = (app:App)=>{
        app.component((comp as any).name,comp as SFCWithInstall<T>)
    }
    return comp as SFCWithInstall<T>
}
const Button = withInstall(button)
export default Button
