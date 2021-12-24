<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-12-24 09:26:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="开工" v-if="hasPerm('process_tab1')"><StartWork /></a-tab-pane>
      <a-tab-pane key="2" tab="进站报工" v-if="hasPerm('process_tab2')"><pullIn/></a-tab-pane>
      <a-tab-pane key="3" tab="出站报工" v-if="hasPerm('process_tab3')"><outbound/></a-tab-pane>
      <a-tab-pane key="4" tab="报工查询" v-if="hasPerm('process_tab4')"><list/></a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import StartWork from './StartWork.vue'
import pullIn from './pullIn.vue'
import outbound from './outbound.vue'
import list from './list.vue'
export default {
  components: { StartWork,pullIn ,outbound,list},
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
