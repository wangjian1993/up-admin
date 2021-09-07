<!--
 * @Author: max
 * @Date: 2021-08-17 10:59:02
 * @LastEditTime: 2021-09-07 15:11:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/List.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-tabs type="card">
        <a-tab-pane key="1" tab="列表查询"><list-search></list-search></a-tab-pane>
        <a-tab-pane key="2" tab="销售要求报价"> </a-tab-pane>
        <a-tab-pane key="3" tab="物料价格变动"> </a-tab-pane>
        <a-tab-pane key="4" tab="有Bom无成本价"> </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import ListSearch from './ListSearch.vue'
export default {
  components: {ListSearch},
  data() {
    return {};
  },
};
</script>

<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
