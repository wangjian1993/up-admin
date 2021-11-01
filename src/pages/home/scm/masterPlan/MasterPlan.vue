<!--
 * @Author: max
 * @Date: 2021-08-31 09:36:32
 * @LastEditTime: 2021-11-01 15:04:27
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/masterPlan/MasterPlan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="采购物料需求总计划" v-if="hasPerm('master_tab1')">
        <plan :plantList="plantList" :stateList="stateList" @toDetail="toDetail"></plan>
      </a-tab-pane>
      <a-tab-pane key="2" tab="采购物料需求总计划明细" v-if="hasPerm('master_tab2')">
        <detail :plantList="plantList" :stateList="stateList" :batchid="batchid" ref="myDeatils"></detail>
      </a-tab-pane>
      <a-tab-pane key="3" tab="采购物料需求总计划异常处理" v-if="hasPerm('master_tab3')">
        <exception :plantList="plantList" :stateList="stateList"></exception>
      </a-tab-pane>
      <a-tab-pane key="4" tab="采购物料需求总计划明细合并" v-if="hasPerm('master_tab4')">
        <detail-merge :plantList="plantList" :stateList="stateList"></detail-merge>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import { getScmAction } from "@/services/web.js";
import { getParamData } from "@/services/admin.js";
import Plan from "./Plan";
import Detail from "./Detail";
import Exception from "./Exception.vue";
import DetailMerge from "./DetailMerge.vue";
export default {
  components: { Plan, Detail, Exception, DetailMerge },
  data() {
    return {
      plantList: [],
      activeKey: "1",
      batchid: "",
      stateList:[]
    };
  },
  created() {
    this.getPlant();
    this.getParamData();
  },
  methods: {
    toDetail(id) {
      this.batchid = id;
      this.activeKey = "2";
      this.$nextTick(() => {
        this.$refs.myDeatils.getListAll();
      });
    },
    callback(key) {
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
      getScmAction(parmas1, "requirement/getlistbytypecode").then((res) => {
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
