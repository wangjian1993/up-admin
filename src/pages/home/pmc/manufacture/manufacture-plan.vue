<!--
 * @Author: max
 * @Date: 2021-06-17 17:28:49
 * @LastEditTime: 2021-09-13 18:54:10
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/manufacture/manufacture-plan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="导入生产日计划">
        <lead-in></lead-in>
      </a-tab-pane>
      <a-tab-pane key="2" tab="生产日计划明细">
        <detail></detail>
      </a-tab-pane>
      <a-tab-pane key="3" tab="生产日计划达成情况">
        <detail></detail>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import LeadIn from "./ leadIn.vue";
import Detail from "./detail.vue";
export default {
  components: { LeadIn, Detail },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
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
