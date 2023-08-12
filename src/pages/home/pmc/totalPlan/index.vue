<!--
 * @Author: max
 * @Date: 2021-08-31 09:36:32
 * @LastEditTime: 2022-02-08 15:07:53
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/TotalPlan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="生成物料需求总计划" v-if="hasPerm('plan_tab1')">
        <Action :plantList="plantList" @toDetail="toDetail" :stateList="stateList"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="发布物料需求总计划" v-if="hasPerm('plan_tab2')">
        <Total :plantList="plantList" @toDetail="toDetail" :stateList="stateList"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="物料需求总计划明细" v-if="hasPerm('plan_tab3')">
        <Detail :plantList="plantList" :batchid="batchid" ref="myDeatils" :stateList="stateList"/>
      </a-tab-pane>
      <a-tab-pane key="4" tab="物料需求总计划明细合并" v-if="hasPerm('plan_tab4')">
        <detail-merge :plantList="plantList" :batchid="batchid" ref="myDeatils" :stateList="stateList"></detail-merge>
      </a-tab-pane>
      <a-tab-pane key="5" tab="物料需求总计划(供应商回复)">
        <Reply :plantList="plantList" :stateList="stateList"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import DetailMerge from "./DetailMerge.vue";
import Action from "./action.vue";
import Detail from "./detail.vue";
import Total from "./total.vue";
import Reply from "./reply.vue";
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
      let params = {
        groupcode: "MITEM_REQUIREMENT_STATUS",
      };
      getParamData(params).then((res) => {
        if (res.data.success) {
          this.stateList = res.data.data;
        }
      });
    },
    //获取需求工厂
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getMitemrequirement(params1, "masterplan/getlistbytypecode").then((res) => {
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
