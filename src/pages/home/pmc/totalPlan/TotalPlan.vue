<!--
 * @Author: max
 * @Date: 2021-08-31 09:36:32
 * @LastEditTime: 2021-08-31 10:01:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/pmc/totalPlan/TotalPlan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="处理物料计划">
        <action></action>
      </a-tab-pane>
      <a-tab-pane key="2" tab="物料需求总计划">
        <total></total>
      </a-tab-pane>
      <a-tab-pane key="3" tab="物料需求总计划明细">
        <detail></detail>
      </a-tab-pane>
      <a-tab-pane key="4" tab="物料需求总计划(供应商回复)">
        <reply></reply>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import Action from "./action.vue";
import Total from "./total.vue";
import Detail from "./detail.vue";
import Reply from "./reply.vue";
export default {
  components: { Action, Detail, Total,Reply },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style>
.ant-form-item {
  margin-bottom: 5px;
}
</style>
