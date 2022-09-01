/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2022-08-31 09:42:42
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/router/async/config.async.js
 */
import routerMap from './router.map'
import {parseRoutes} from '@/utils/routerUtil'

// 异步路由配置
const routesConfig = [
  'login',
  'root',
  'none',
  'supplierLogin',
  'supplierRegister',
  {
    router: 'exp404',
    path: '*',
    name: '404'
  },
  {
    router: 'exp403',
    path: '/403',
    name: '403'
  }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
