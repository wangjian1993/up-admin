<!--
 * @Author: max
 * @Date: 2021-12-17 09:08:09
 * @LastEditTime: 2021-12-27 15:37:39
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/aging/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="开始老化" v-if="hasPerm('aging_tab1')"><startAging /></a-tab-pane>
      <a-tab-pane key="2" tab="老化查询" v-if="hasPerm('aging_tab2')"><list/></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import startAging from './startAging.vue'
import list from './list.vue'
export default {
  components: { startAging,list},
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