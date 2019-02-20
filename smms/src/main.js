//引入vue
import Vue from 'vue'

//引入axios
import axios from 'axios'

//引入elementui的组件 和 样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//解构引入组件
import {Message} from 'element-ui';
//引入顶级组件
import App from './App.vue'
//引入路由文件
import router from './router'

//引入公用样式
import '@/styles/common.less'

//注册elementui
Vue.use(ElementUI);

// 把axios挂在Vue的原型上 所有vue的实例对象共享
Vue.prototype.axios = axios;

//全局路由守卫，拦截所有路由
router.beforeEach((to,from,next) => {
  //获取token
  const token = window.localStorage.getItem('token');
  //判断
  if(token){ //存在token
    next(); //放行
  }else{ //不存在
    //如果去的是登录页面
    if(to.path === '/login'){
      next();
    }else{
      Message.error("请登录之后再操作");
      return next({"path":"/login"});
    }
  }
})

//阻止生产提示
Vue.config.productionTip = false

//创建vue实例对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
