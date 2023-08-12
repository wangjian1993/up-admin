<!--
 * @Author: max
 * @Date: 2022-04-14 11:28:34
 * @LastEditTime: 2023-08-12 14:03:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/index.vue
-->

<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" default-active-key="1" v-model="tabKey" @change="callback">
      <a-tab-pane key="1" tab="批量转换供应商价格" v-if="hasPerm('price_tab1')"></a-tab-pane>
      <a-tab-pane key="2" tab="供应商价格提交记录" v-if="hasPerm('price_tab2')"> </a-tab-pane>
      <a-tab-pane key="3" tab="提取参数" v-if="hasPerm('price_tab3')"> </a-tab-pane>
    </a-tabs>
    <list v-show="tabKey == 1 && hasPerm('price_tab1')" ref="tab1" />
    <record v-show="tabKey == 2 && hasPerm('price_tab2')" ref="tab2" />
    <params v-show="tabKey == 3 && hasPerm('price_tab3')" ref="tab3" />
  </a-card>
</template>
<script>
import list from "./list.vue";
import record from "./record.vue";
import params from "./params.vue";
export default {
  components: { list, record ,params },
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
    callback(key) {
      this.tabKey = key;
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
