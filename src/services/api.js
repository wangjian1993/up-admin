/*
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2023-03-17 08:54:56
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
if (process.env.NODE_ENV == 'production') {
  //正式服
  BASE_URL_MOCK = window.location.host === '113.106.78.83:7003' ? 'http://113.106.78.83:7004' : 'http://192.168.0.240:8081';
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
  UP_BOM: `${BASE_URL_MOCK}/api/bomreport`,
  UP_ERP: `${BASE_URL_MOCK}/api/erp`,
  UP_CMS: `${BASE_URL_MOCK}/api/cms`,
  UP_WMS: `${BASE_URL_MOCK}/api/wms`,
  UP_HP: `${BASE_URL_MOCK}/api/feb/hptc`,
  UP_ESOP: `${BASE_URL_MOCK}/api/esop`,
  UP_REPORT: `${BASE_URL_MOCK}/api/report`,
  UP_EAP: `${BASE_URL_MOCK}/api/eap`,
  UP_MQTT: `${BASE_URL_MOCK}/api/mqtt`,
  UP_SRM: `${BASE_URL_MOCK}/api/srm`,
  UP_TPL:`${BASE_URL_MOCK}/api/template`,
  UP_KANBAN:`${BASE_URL_MOCK}/api/kanban`,
  UP_JOB:`${BASE_URL_MOCK}/api/jobscheduler`,
  UP_TL:`${BASE_URL_MOCK}/api/template`,
  UP_QMS:`${BASE_URL_MOCK}/api/qms`,
  UP_ORS:`${BASE_URL_MOCK}/api/ors`,
}
