/*
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-09-04 08:47:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/api.js
 */
//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// console.log("BASE_URL===",BASE_URL)
const BASE_URL_MOCK = process.env.VUE_APP_API_BASE_URL
const BASE_URL ="http://172.16.0.20"
module.exports = {
  LOGIN: `${BASE_URL_MOCK}/login`,
  ROUTES: `${BASE_URL_MOCK}/routes`,
  GOODS: `${BASE_URL_MOCK}/goods`,
  GOODS_COLUMNS: `${BASE_URL_MOCK}/columns`,
  MB_CLOUD:`${BASE_URL}/workflow/upshine/bom_cost/`,
  UP_ADMIN:'http://192.168.1.245:6688/api/base',
  UP_WEB:'http://192.168.1.245:6688/api/feb'
}
