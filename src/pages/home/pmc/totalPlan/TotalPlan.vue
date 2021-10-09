<!--
 * @Author: max
 * @Date: 2021-08-31 09:36:32
 * @LastEditTime: 2021-10-09 11:01:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/TotalPlan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="处理物料计划" v-if="hasPerm('plan_tab1')">
        <action :plantList="plantList" @toDetail="toDetail" :stateList="stateList"></action>
      </a-tab-pane>
      <a-tab-pane key="2" tab="物料需求总计划" v-if="hasPerm('plan_tab2')">
        <total :plantList="plantList" @toDetail="toDetail" :stateList="stateList"></total>
      </a-tab-pane>
      <a-tab-pane key="3" tab="物料需求总计划明细" v-if="hasPerm('plan_tab3')">
        <detail :plantList="plantList" :batchid="batchid" ref="myDeatils" :stateList="stateList"></detail>
      </a-tab-pane>
      <a-tab-pane key="4" tab="物料需求总计划明细合并" v-if="hasPerm('plan_tab4')">
        <detail-merge :plantList="plantList" :batchid="batchid" ref="myDeatils" :stateList="stateList"></detail-merge>
      </a-tab-pane>
      <a-tab-pane key="5" tab="物料需求总计划(供应商回复)">
        <reply :plantList="plantList" :stateList="stateList"></reply>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import DetailMerge from "./DetailMerge.vue";
import Action from "./Action.vue";
import Detail from "./Detail.vue";
import Total from "./Total.vue";
import Reply from "./Reply.vue";
import { getMitemrequirement } from "@/services/web.js";
import { getParamData } from "@/services/admin.js";
export default {
  components: { Action, Detail, Total, Reply, DetailMerge },
  data() {
    return {
      plantList: [],
      activeKey: "1",
      batchid: "",
      stateList: [],
    };
  },
  created() {
    this.getPlant();
    this.getParamData();
  },
  methods: {
    toDetail(id, tab) {
      this.batchid = id;
      this.activeKey = tab;
      this.$nextTick(() => {
        this.$refs.myDeatils.getListAll();
      });
    },
    callback(key) {
      console.log(key);
      this.activeKey = key;
    },
    getParamData() {
      let parmas = {
        groupcode: "MITEM_REQUIREMENT_STATUS",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.stateList = res.data.data;
        }
      });
    },
    //获取需求工厂
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getMitemrequirement(parmas1, "masterplan/getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
  },
};
</script>
<style>
.ant-form-item {
  margin-bottom: 5px;
}
</style>
