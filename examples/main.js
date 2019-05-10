import Vue from 'vue'
import { Select, Option, Popover, Button } from 'element-ui'
import App from './App.vue'

// 导入组件库
import CitySelector from './../packages/index'
// 注册组件库
Vue.use(Select)
Vue.use(Option)
Vue.use(Popover)
Vue.use(CitySelector)
Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
