/*
 * @Author: max
 * @Date: 2021-08-17 08:26:18
 * @LastEditTime: 2021-12-07 18:09:22
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
// import Icon from 'vue-awesome/components/Icon';
// import 'vue-awesome/icons/chart-bar.js';
// import 'vue-awesome/icons/chart-area.js';
// import 'vue-awesome/icons/chart-pie.js';
// import 'vue-awesome/icons/chart-line.js';
// import 'vue-awesome/icons/align-left.js';
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
// Vue.component('icon', Icon);
Vue.use(dataV);
const router = initRouter(store.state.setting.asyncRoutes);
const i18n = initI18n('CN', 'US')
import { hasBtnPermission } from './utils/permissions';
//将DOM转为PDF
import htmlToPdf from './utils/htmlToPdf';
Vue.use(htmlToPdf);
Vue.prototype.hasPerm = hasBtnPermission;
Vue.use(Antd);
Vue.config.productionTip = false;
Vue.use(Viser);
Vue.use(Plugins);
import Print from 'vue-print-nb'
Vue.use(Print); //注册
bootstrap({ router, store, i18n, message: Vue.prototype.$message });
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
