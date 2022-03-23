<!--
 * @Author: max
 * @Date: 2022-03-23 17:24:10
 * @LastEditTime: 2022-03-23 17:26:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/shipment/shipment.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="UP" v-if="hasPerm('tab_up')"><UpSubmit/></a-tab-pane>
      <a-tab-pane key="2" tab="AGC" v-if="hasPerm('tab_agc')"><AgcSubmit/></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import UpSubmit from "./up/submit";
import AgcSubmit from "./agc/submit";
export default {
  components: { UpSubmit, AgcSubmit },
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
