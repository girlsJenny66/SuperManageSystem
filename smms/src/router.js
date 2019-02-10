//引入vue
import Vue from 'vue'
//引入路由
import Router from 'vue-router'
//引入home组件
//import Home from './views/Home.vue'

//注册路由
Vue.use(Router)

//导出路由实例对象
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue') //引入登录组件
    },
    {
      path: '/',
      name: 'index',
      component: () => import('./views/Index/Index.vue'), //引入后端首页组件
      children:[
        {
          path: '',
          name: 'home',
          component: () => import('./views/Home/Home.vue')
        },
        {
          path: '/goodsmanage',
          name: 'goodsmanage',
          component: () => import('./views/GoodsManage/GoodsManage.vue')
        },
        {
          path: '/goodsadd',
          name: 'goodsadd',
          component: () => import('./views/GoodsAdd/GoodsAdd.vue')
        },
        {
          path: '/stockmanage',
          name: 'stockmanage',
          component: () => import('./views/StockManage/StockManage.vue')
        },
        {
          path: '/stockadd',
          name: 'stockadd',
          component: () => import('./views/StockAdd/StockAdd.vue')
        },
        {
          path: '/saleslist',
          name: 'saleslist',
          component: () => import('./views/SalesList/SalesList.vue')
        },
        {
          path: '/goodsoutofstock',
          name: 'goodsoutofstock',
          component: () => import('./views/GoodsOutofStock/GoodsOutofStock.vue')
        },
        {
          path: '/returngoods',
          name: 'returngoods',
          component: () => import('./views/ReturnGoods/ReturnGoods.vue')
        },
        {
          path: '/salestatistics',
          name: 'salestatistics',
          component: () => import('./views/SaleStatistics/SaleStatistics.vue')
        },
        {
          path: '/stockstatistics',
          name: 'stockstatistics',
          component: () => import('./views/StockStatistics/StockStatistics.vue')
        },
        {
          path: '/accountmanage',
          name: 'accountmanage',
          component: () => import('./views/AccountManage/AccountManage.vue')
        },
        {
          path: '/accountadd',
          name: 'accountadd',
          component: () => import('./views/AccountAdd/AccountAdd.vue')
        },
        {
          path: '/passwordmodify',
          name: 'passwordmodify',
          component: () => import('./views/PasswordModify/PasswordModify.vue')
        },
        {
          path: '/membermanage',
          name: 'membermanage',
          component: () => import('./views/MemberManage/MemberManage.vue')
        },
        {
          path: '/memberadd',
          name: 'memberadd',
          component: () => import('./views/MemberAdd/MemberAdd.vue')
        },
      ]
    }
  ]
})
