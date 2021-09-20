/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2021-09-20 15:00:14
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/router/async/router.map.js
 */
// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  root: {
    path: '/',
    name: '首页',
    redirect: '/login',
    component: view.tabs
  },
  dashboard: {
    name: '控制面板',
    invisible: true,
    component: view.blank
  },
  workplace: {
    name: '工作台',
    path: 'workplace',
    component: () => import('@/pages/dashboard/workplace')
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  },
  quote: {
    invisible: true,
    name: '采购报价',
    component: view.blank
  },
  copy: {
    invisible: true,
    name: '复制报价',
    path: 'purchase/copy',
    component: () => import('@/pages/home/quote/purchase/copy')
  },
  anew: {
    invisible: true,
    name: '重新报价',
    path: 'purchase/anew',
    component: () => import('@/pages/home/quote/purchase/anew')
  },
  personal: {
    invisible: true,
    name: '个人中心',
    component: view.blank
  },
  user: {
    name: '个人中心',
    path: 'user',
    component: () => import('@/pages/personal')
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },
  none: {
    path: '*',
    redirect: '/workplace'
  },
}
export default routerMap

