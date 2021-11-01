<!--
 * @Author: max
 * @Date: 2021-06-17 17:28:49
 * @LastEditTime: 2021-11-01 14:56:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/manufacture/manufacture-plan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="导入生产日计划" v-if="hasPerm('manufacture_tab1')">
        <lead-in @toDetail="toDetail"></lead-in>
      </a-tab-pane>
      <a-tab-pane key="2" tab="生产日计划明细" v-if="hasPerm('manufacture_tab2')">
        <detail :detailData="detailData" ref="myDeatils" :stateList="stateList"></detail>
      </a-tab-pane>
      <a-tab-pane key="3" tab="生产日计划达成情况" v-if="hasPerm('manufacture_tab3')">
        <achievement :stateList="stateList"></achievement>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import LeadIn from "./leadIn.vue";
import Detail from "./detail.vue";
import Achievement from "./achievement.vue";
import { getParamData } from "@/services/admin.js";
export default {
  components: { LeadIn, Detail, Achievement },
  data() {
    return {
      activeKey: "1",
      detailData: [],
    };
  },
  created() {
    this.getParamData();
  },
  methods: {
    toDetail(item) {
      this.detailData = item;
      this.activeKey = "2";
      this.$nextTick(() => {
        this.$refs.myDeatils.getListAll();
      });
    },
    getParamData() {
      let parmas = {
        groupcode: "DAILY_PRODUCTION_PLAN_STATUS",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.stateList = res.data.data;
        }
      });
    },
    callback(key) {
      console.log(key);
      this.activeKey = key;
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
.down-excel {
  font-size: 12px;
  margin-left: 20px;
  color: #000;
  text-decoration: underline;
}
</style>
