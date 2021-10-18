<!--
 * @Author: max
 * @Date: 2021-10-18 08:34:37
 * @LastEditTime: 2021-10-18 16:35:30
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/BeProduced/BeProduced.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="导入待产计划与待排计划需求" v-if="hasPerm('plan_tab1')">
        <lead-in @toDetail="toDetail" :plantList="plantList" :stateList="stateList"></lead-in>
      </a-tab-pane>
      <a-tab-pane key="2" tab="查询计划计算结果" v-if="hasPerm('plan_tab2')">
        <result :batchid="batchid" ref="myDeatils" :plantList="plantList"></result>
      </a-tab-pane>
      <a-tab-pane key="3" tab="导出物料需求计划" v-if="hasPerm('plan_tab3')">
        <export-plan :plantList="plantList"></export-plan>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import LeadIn from "./leadIn.vue";
import Result from "./Result.vue";
import ExportPlan from "./ExportPlan.vue";
import { getMitemPlanAction } from "@/services/web.js";
import { getParamData } from "@/services/admin.js";
export default {
  components: { LeadIn, Result, ExportPlan },
  data() {
    return {
      activeKey: "1",
      batchid: "",
      plantList: [],
      stateList: [],
    };
  },
  created() {
    this.getPlant();
    this.getParamData();
  },
  methods: {
    //获取需求工厂
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getMitemPlanAction(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getParamData() {
      let parmas = {
        groupcode: "MITEM_OUTPUT_PLAN_STATUS",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.stateList = res.data.data;
        }
      });
    },
    toDetail(id) {
      console.log(id);
      this.batchid = id;
      this.activeKey = "2";
      this.$nextTick(() => {
        this.$refs.myDeatils.getListAll();
      });
    },
    callback(key) {
      console.log(key);
      this.activeKey = key;
    },
  },
};
</script>
<style lang="less">
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
