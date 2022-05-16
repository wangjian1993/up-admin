<!--
 * @Author: max
 * @Date: 2022-03-25 17:26:16
 * @LastEditTime: 2022-05-16 17:08:23
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/registration/index.vue
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
      <a-tab-pane key="1" tab="公共" v-if="hasPerm('registration_tab1')"></a-tab-pane>
      <a-tab-pane key="2" tab="后台" v-if="hasPerm('registration_tab2')"></a-tab-pane>
    </a-tabs>
    <registration :rolesign="rolesign" ref="discountBox"/>
  </a-card>
</template>
<script>
import registration from "./registration.vue";
export default {
  components: { registration },
  data() {
    return {
      advanced: true,
      rolesign: "",
    };
  },
  created() {
    this.rolesign = this.hasPerm("registration_tab1") ? "PERSONAL" : "ADMIN";
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
