// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import babelpolyfill from 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import echarts from 'echarts'  //引用echarts图表
import store from './store'

//import Mock from './mock'
//Mock.bootstrap();

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.use(babelpolyfill)


router.beforeEach((to, from, next) => {

	if (to.path == '/login') {
	    sessionStorage.removeItem('userinfo');
	}
	let user = JSON.parse(sessionStorage.getItem('userinfo'));
	if (!user && to.path != '/login') {
	    next({ path: '/login' })
	} else {
	    next()
	}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
