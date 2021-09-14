<!--
 * @Author: max
 * @Date: 2021-06-17 17:28:49
 * @LastEditTime: 2021-09-14 10:19:14
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/material/material-plan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="导入物料需求" :disabled="!hasPerm('material_tab1')">
        <lead-in @toDetail="toDetail"></lead-in>
      </a-tab-pane>
      <a-tab-pane key="2" tab="物料需求明细" :disabled="!hasPerm('material_tab2')">
        <detail :batchid="batchid" ref="myDeatils"></detail>
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
    return {
      activeKey: "1",
      batchid: "",
    };
  },
  methods: {
    toDetail(id) {
      console.log(id);
      this.batchid = id;
      this.activeKey = "2";
      this.$nextTick(() => {
        this.$refs.myDeatils.getListAll();
      });
    },
    callback(key) {
      console.log(key);
      this.activeKey = key;
    },
  },
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
