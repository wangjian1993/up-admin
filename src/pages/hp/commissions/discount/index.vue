<!--
 * @Author: max
 * @Date: 2022-03-25 17:12:43
 * @LastEditTime: 2022-03-25 17:45:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/discount/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="个人" v-if="hasPerm('tab_user')"></a-tab-pane>
      <a-tab-pane key="2" tab="财务" v-if="hasPerm('tab_finance')"></a-tab-pane>
    </a-tabs>
    <discount/>
  </a-card>
</template>
<script>
import discount from "./discount.vue";
export default {
  components: { discount },
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
