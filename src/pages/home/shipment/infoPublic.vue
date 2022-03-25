<!--
 * @Author: max
 * @Date: 2022-03-23 17:24:10
 * @LastEditTime: 2022-03-24 09:01:28
 * @LastEditors: max
 * @Description: 我要出货
 * @FilePath: /up-admin/src/pages/home/shipment/infoPersonal.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="UP" v-if="hasPerm('tab_up')"><UpInfoPersonal /></a-tab-pane>
      <a-tab-pane key="2" tab="AGC" v-if="hasPerm('tab_agc')"><AgcInfoPersonal /></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import UpInfoPersonal from "./up/infoPersonal/index.vue";
import AgcInfoPersonal from "./agc/infoPersonal/index.vue";
export default {
  components: { UpInfoPersonal, AgcInfoPersonal },
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
