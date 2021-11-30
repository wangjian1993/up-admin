<!--
 * @Author: max
 * @Date: 2021-11-30 14:31:19
 * @LastEditTime: 2021-11-30 16:38:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/processLine/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="工序管理" v-if="hasPerm('process_line_tab1')"><Process /></a-tab-pane>
      <a-tab-pane key="2" tab="工序产线配置" v-if="hasPerm('process_line_tab2')"><ProcessLine /></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import Process from "./process.vue";
import ProcessLine from "./processLine.vue";
export default {
  components: { Process, ProcessLine },
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
