<!--
 * @Author: max
 * @Date: 2022-03-25 17:26:16
 * @LastEditTime: 2022-03-30 11:30:08
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/commission/index.vue
-->
<!--
 * @Author: max
 * @Date: 2022-03-25 17:26:16
 * @LastEditTime: 2022-03-30 10:58:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/collection/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="个人" v-if="hasPerm('tab_user')"></a-tab-pane>
      <a-tab-pane key="2" tab="财务" v-if="hasPerm('tab_finance')"></a-tab-pane>
    </a-tabs>
    <commission :rolesign="rolesign" :columns="columns" ref="discountBox" />
  </a-card>
</template>
<script>
import commission from "./commission.vue";
import { columns } from "./list.data";
export default {
  components: { commission },
  data() {
    return {
      advanced: true,
      rolesign: "",
      columns,
      columnsBack: columns,
    };
  },
  created() {
    this.rolesign = this.hasPerm("tab_user") ? "PERSONAL" : "ADMIN";
  },
  methods: {
    callback(key) {
      this.rolesign = key == 1 ? "PERSONAL" : "ADMIN";
      this.$refs.discountBox.reset();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
