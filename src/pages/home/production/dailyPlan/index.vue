<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-11-13 09:21:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="产线生产日计划查询" v-if="hasPerm('daily_plan_tab1')"><list></list></a-tab-pane>
      <a-tab-pane key="2" tab="产线生产日计划看板" v-if="hasPerm('daily_plan_tab2')"><kanban></kanban></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import List from "./list.vue";
import Kanban from "./kanban.vue";
export default {
  components: { List, Kanban },
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
