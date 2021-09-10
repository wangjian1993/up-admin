<!--
 * @Author: max
 * @Date: 2021-06-17 17:28:49
 * @LastEditTime: 2021-09-09 17:56:12
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/material/material-plan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card">
      <a-tab-pane key="1" tab="导入物料需求">
        <lead-in></lead-in>
      </a-tab-pane>
      <a-tab-pane key="2" tab="物料需求明细">
        <detail></detail>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import LeadIn from "./leadIn.vue";
import Detail from "./detail.vue";
export default {
  components: { LeadIn, Detail },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.down-excel {
  font-size: 12px;
  margin-left: 20px;
  color: #000;
  text-decoration: underline;
}
</style>
