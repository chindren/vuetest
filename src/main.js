// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 全局组件
import './components/index'
// 全局过滤器
import "./filter"
// 引入store
import store from './store'
// 引入element-ui
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
// import Vuex from 'vuex'
// Vue.use(Vuex)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
