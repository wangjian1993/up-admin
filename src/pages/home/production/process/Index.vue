<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2022-03-22 09:58:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <!-- <a-tabs type="card" default-active-key="1" v-model="tabKey" @change="callback">
      <a-tab-pane key="1" tab="开工" v-if="hasPerm('process_tab1')"><StartWork ref="tab1"/></a-tab-pane>
      <a-tab-pane key="2" tab="进站报工" v-if="hasPerm('process_tab2')"><pullIn ref="tab2"/></a-tab-pane>
      <a-tab-pane key="3" tab="出站报工" v-if="hasPerm('process_tab3')"><a-input /><outbound ref="tab3"/></a-tab-pane>
      <a-tab-pane key="4" tab="报工查询" v-if="hasPerm('process_tab4')"><list /> ></a-tab-pane>
    </a-tabs> -->
    <a-tabs type="card" default-active-key="1" v-model="tabKey" @change="callback">
      <a-tab-pane key="1" tab="开工" v-if="hasPerm('process_tab1')"></a-tab-pane>
      <a-tab-pane key="2" tab="进站报工" v-if="hasPerm('process_tab2')"> </a-tab-pane>
      <a-tab-pane key="3" tab="出站报工" v-if="hasPerm('process_tab3')"></a-tab-pane>
      <a-tab-pane key="4" tab="报工查询" v-if="hasPerm('process_tab4')"></a-tab-pane>
    </a-tabs>
    <StartWork v-show="tabKey == 1" ref="tab1" />
    <pullIn v-show="tabKey == 2" ref="tab2" />
    <outbound v-show="tabKey == 3" ref="tab3" />
    <list v-if="tabKey == 4" ref="tab4" />
    <!-- <div class="tab-box">
      <div @click="tabClick(1)">tab1</div>
      <div @click="tabClick(2)">tab2</div>
      <div @click="tabClick(3)">tab3</div>
      <StartWork v-if="tabIndex == 1" />
      <pullIn v-if="tabIndex == 2" />
      <outbound v-if="tabIndex == 3" />
    </div> -->
  </a-card>
</template>
<script>
import StartWork from "./StartWork.vue";
import pullIn from "./pullIn.vue";
import outbound from "./outbound.vue";
import list from "./list.vue";
export default {
  components: { StartWork, pullIn, outbound, list },
  data() {
    return {
      advanced: true,
      tabKey: "1",
      tabIndex: 1,
    };
  },
  methods: {
    tabClick(index) {
      console.log(index);
      this.tabIndex = index;
    },
    callback(key) {
      this.tabKey = key;
      if (key == 1) {
        this.$refs.tab1.setFocus();
      } else if (key == 2) {
        this.$refs.tab2.setFocus();
      } else if (key == 3) {
        this.$refs.tab3.setFocus();
      } else if (key == 4) {
        // this.$refs.tab4.setTableHeigh();
      }
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.tab-box {
  display: flex;
  div {
    padding: 0 30px;
  }
}
</style>
