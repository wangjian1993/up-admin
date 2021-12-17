<!--
 * @Author: max
 * @Date: 2021-12-17 09:08:09
 * @LastEditTime: 2021-12-17 09:12:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/rework/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="返工录入" v-if="hasPerm('rework_tab1')"><record /></a-tab-pane>
      <a-tab-pane key="2" tab="返工查询" v-if="hasPerm('rework_tab2')"><list/></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import record from './record.vue'
import list from './list.vue'
export default {
  components: { record,list},
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