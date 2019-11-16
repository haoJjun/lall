import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/index.less'
import axios from 'axios'
import 'nprogress/nprogress.css'
// 设置常态地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// 将axios共享给所有实例使用
Vue.prototype.$axios = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
