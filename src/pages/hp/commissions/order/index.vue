<!--
 * @Author: max
 * @Date: 2022-03-25 17:26:16
 * @LastEditTime: 2022-03-29 17:43:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/order/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="个人" v-if="hasPerm('tab_user')"></a-tab-pane>
      <a-tab-pane key="2" tab="财务" v-if="hasPerm('tab_finance')"></a-tab-pane>
    </a-tabs>
    <order :rolesign="rolesign" :columns="columns" ref="discountBox" />
  </a-card>
</template>
<script>
import order from "./order.vue";
import { columns } from "./list.data";
export default {
  components: { order },
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
  mounted() {
    // 此处根据权限来删减表头
    if (this.hasPerm("tab_user")) {
      this.columns = this.columns.filter((item) => item.title !== "操作"); // 控制客户经理列是否展示
    } else {
      this.columns = this.columnsBack;
    }
    console.log("this.columns", this.columns);
  },
  methods: {
    callback(key) {
      this.rolesign = key == 1 ? "PERSONAL" : "ADMIN";
      if (key == 1) {
        this.columns = this.columns.filter((item) => item.title !== "操作"); // 控制客户经理列是否展示
      } else {
        this.columns = this.columnsBack;
        console.log("thsi.rolesign----", this.rolesign);
        this.$refs.discountBox.getAdminList();
      }
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
