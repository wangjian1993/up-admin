<!--
 * @Author: max
 * @Date: 2022-02-23 11:03:48
 * @LastEditTime: 2022-02-23 14:59:00
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/costPrice/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1">
      <a-tab-pane key="1" tab="成品查询" v-if="hasPerm('price_tab1')"><Content :pageType="1"/></a-tab-pane>
      <a-tab-pane key="2" tab="半成品查询" v-if="hasPerm('price_tab2')"><Content :pageType="2"/></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import Content from "./content.vue";
export default {
  components: { Content },
  data() {
    return {
      activeKey: "1",
    };
  },
  created() {},
  methods: {},
};
</script>
<style>
.ant-form-item {
  margin-bottom: 5px;
}
</style>
