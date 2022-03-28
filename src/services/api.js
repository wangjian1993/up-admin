/*
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2022-03-28 11:04:06
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/api.js
 */
//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// console.log("BASE_URL===",BASE_URL)

// if (process.env.NODE_ENV === 'production') {//生产环境地址
//   BASE_URL_MOCK = 'http://192.168.0.240:8081'
// } else {//开发环境地址
//   BASE_URL_MOCK = 'http://192.168.1.245:6688'
// }
var BASE_URL_MOCK;
console.log(window.location);
if (process.env.NODE_ENV == 'production') {
  //正式服
  BASE_URL_MOCK = window.location.host === '218.17.19.58:7003' ? 'http://218.17.19.58:7004' : 'http://192.168.0.240:8081';
} else {
  //测试
  BASE_URL_MOCK = process.env.VUE_APP_API_BASE_URL;
}
const BASE_URL = "http://172.16.0.20"
module.exports = {
  LOGIN: `${BASE_URL_MOCK}/login`,
  ROUTES: `${BASE_URL_MOCK}/routes`,
  GOODS: `${BASE_URL_MOCK}/goods`,
  GOODS_COLUMNS: `${BASE_URL_MOCK}/columns`,
  MB_CLOUD: `${BASE_URL}/workflow/upshine/bom_cost/`,
  UP_ADMIN: `${BASE_URL_MOCK}/api/base`,
  UP_WEB: `${BASE_URL_MOCK}/api/feb`,
  UP_USER: `${BASE_URL_MOCK}/api/auth`,
  UP_ERP: `${BASE_URL_MOCK}/api/erpreport`,
  UP_CMS: `${BASE_URL_MOCK}/api/cms`,
  UP_WMS: `${BASE_URL_MOCK}/api/wms`,
  UP_HP: `${BASE_URL_MOCK}/api/feb/hptc`,
  UP_ESOP: `${BASE_URL_MOCK}/api/esop`
}
