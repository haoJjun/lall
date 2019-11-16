import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home'
import Layout from '../views/layout'
import Login from '../views/login'
import Home from '@/views/home'
import Article from '../views/article'
import Publish from '@/views/publish'
import NProgress from 'nprogress'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        // 首页
        path: '',
        component: Home
      },
      {
        // 文章列表
        path: '/article',
        component: Article
      },
      {
        // 发布文章
        path: '/publish',
        component: Publish
      }
    ]
  },

  {
    // 一级路，登陆主页
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})
// 路由拦截器
// to 要去哪里的路由信息
// from 来自哪里的路由信息
// next 他是一个方法，路由放行
router.beforeEach((to, from, next) => {
  // 开启顶部导航进度条特效
  NProgress.start()
  console.log('所有页面访问都经过这里')
  // 获取用户 token 判断是否有 有就通过 没有就跳转登录页

  // 如果访问的页面是登录页，则直接放行
  if (to.path === '/login') {
    next()
    // 停止代码后执行
    return
  }

  // 非登陆页面，校验登陆状态
  // 获取token
  const token = window.localStorage.getItem('user-token')
  if (token) {
    next()
  } else {
    next('/login')
    NProgress.done()
  }
})

// 路由导航结束以后出发的钩子函数
router.afterEach((to, from) => {
  // 结束导航进度条
  NProgress.done()
})
export default router
