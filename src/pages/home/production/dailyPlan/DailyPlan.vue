<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-09-01 11:03:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/DailyPlan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="生产日计划明细"><detail></detail></a-tab-pane>
      <a-tab-pane key="2" tab="生产日计划看板"><kanban></kanban></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import Detail from "./detail.vue";
import Kanban from "./kanban.vue";
export default {
  components: { Detail, Kanban },
  data() {
    return {
      advanced: true,
    };
  },
  methods: {
    callback(key) {
      console.log(key);
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
