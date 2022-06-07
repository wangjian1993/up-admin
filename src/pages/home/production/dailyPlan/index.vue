<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2022-06-06 14:42:38
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="产线生产日计划查询" v-if="hasPerm('daily_plan_tab1')"></a-tab-pane>
      <a-tab-pane key="2" tab="产线生产日计划看板" v-if="hasPerm('daily_plan_tab2')"></a-tab-pane>
    </a-tabs>
    <list v-show="tabIndex == 1 && hasPerm('daily_plan_tab1')"></list>
    <kanban v-show="tabIndex == 2 && hasPerm('daily_plan_tab2')"></kanban>
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
      tabIndex: 1,
    };
  },
  methods: {
    callback(key) {
      console.log(key);
      this.tabIndex = key;
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
