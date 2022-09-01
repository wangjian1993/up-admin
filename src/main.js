/*
 * @Author: max
 * @Date: 2021-08-17 08:26:18
 * @LastEditTime: 2022-08-17 17:17:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/main.js
 */
import Vue from 'vue';
import App from './App.vue';
import { initRouter } from './router';
import './theme/index.less';
import Antd from 'ant-design-vue';
import Viser from 'viser-vue';
import '@/mock';
import store from './store';
import 'animate.css/source/animate.css';
import Plugins from '@/plugins';
import { initI18n } from '@/utils/i18n';
import bootstrap from '@/bootstrap';
import 'moment/locale/zh-cn';
//datav
import dataV from '@jiaminghi/data-view';
// 挂载全局使用的方法
import VueDraggableResizable from 'vue-draggable-resizable'
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.use(dataV);
//easyui
// import 'vx-easyui/dist/themes/default/easyui.css';
// import 'vx-easyui/dist/themes/icon.css';
// import 'vx-easyui/dist/themes/vue.css';
// import EasyUI from 'vx-easyui';
// Vue.use(EasyUI);
const router = initRouter(store.state.setting.asyncRoutes);
const i18n = initI18n('CN', 'US')
import { hasBtnPermission } from './utils/permissions';
//将DOM转为PDF
// import htmlToPdf from './utils/htmlToPdf';
// Vue.use(htmlToPdf);
Vue.prototype.hasPerm = hasBtnPermission;
Vue.use(Antd);
Vue.config.productionTip = false;
Vue.use(Viser);
Vue.use(Plugins);
import Print from 'vue-print-nb'
Vue.use(Print); //注册
bootstrap({ router, store, i18n, message: Vue.prototype.$message });
import Viewer from 'v-viewer'

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
//hiprint 打印
// import {hiPrintPlugin} from 'vue-plugin-hiprint'
// Vue.use(hiPrintPlugin);

// import Storage from 'vue-ls'
// let options = {
//   namespace: 'hiPrint-',
//   name: 'ls',
//   storage: 'local',
// };
// Vue.use(Storage, options);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
