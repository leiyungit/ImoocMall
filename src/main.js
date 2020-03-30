// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  //error: 'dist/error.png',
  loading: '/static/loading-svg/loading-bars.svg',
  attempt: 1
}); // 图片懒加载

Vue.use(infiniteScroll); // 无限滚动

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
