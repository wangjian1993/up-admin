<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2022-10-13 13:55:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/index.vue
-->
<template>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-tabs type="card" default-active-key="1" v-model="tabKey">
        <a-tab-pane key="1" tab="工序管理" v-if="hasPerm('process_tab1')"></a-tab-pane>
        <a-tab-pane key="2" tab="工序产线配置" v-if="hasPerm('process_tab2')"> </a-tab-pane>
        <a-tab-pane key="3" tab="工艺路线配置" v-if="hasPerm('process_tab3')"></a-tab-pane>
      </a-tabs>
      <Process v-show="tabKey == 1 && hasPerm('process_tab1')" ref="tab1" />
      <ProcessLine v-show="tabKey == 2 && hasPerm('process_tab2')" ref="tab2" />
      <Craft v-show="tabKey == 3 && hasPerm('process_tab3')" ref="tab3" />
    </a-card>
  </template>
  <script>
  import Craft from "./craft.vue";
  import ProcessLine from './line.vue';
  import Process from "./process.vue";
  export default {
    components: { Craft, ProcessLine, Process },
    data() {
      return {
        advanced: true,
        tabKey: "1",
        tabIndex: 1,
      };
    },
    methods: {
      tabClick(index) {
        console.log(index);
        this.tabIndex = index;
      },
    },
  };
  </script>
  <style lang="less">
  .ant-form-item {
    margin-bottom: 5px;
  }
  .tab-box {
    display: flex;
    div {
      padding: 0 30px;
    }
  }
  </style>
  