<!--
 * @Author: max
 * @Date: 2021-08-31 09:36:32
 * @LastEditTime: 2021-09-23 14:20:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/masterPlan/MasterPlan.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="采购物料需求总计划">
        <plan :plantList="plantList"></plan>
      </a-tab-pane>
      <a-tab-pane key="2" tab="采购物料需求总计划明细">
        <detail :plantList="plantList" @toDetail="toDetail"></detail>
      </a-tab-pane>
      <a-tab-pane key="3" tab="采购物料需求总计划异常处理">
        <exception :plantList="plantList" :batchid="batchid" ref="myDeatils"></exception>
      </a-tab-pane>
      <a-tab-pane key="4" tab="采购物料需求总计划明细合并">
        <detail-merge :plantList="plantList"></detail-merge>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import { getScmAction } from "@/services/web.js";
import Plan from './Plan'
import Detail from './Detail'
import Exception from './Exception.vue'
import DetailMerge from './DetailMerge.vue'
export default {
  components: { Plan, Detail, Exception, DetailMerge },
  data() {
    return {
      plantList: [],
      activeKey: "1",
      batchid: "",
    };
  },
  created() {
    this.getPlant();
  },
  methods: {
     toDetail(id) {
      console.log(id)
      this.batchid = id;
      console.log(this.batchid)
      this.activeKey = "3";
      this.$nextTick(() => {
        this.$refs.myDeatils.getListAll();
      });
    },
    callback(key) {
      this.activeKey = key;
    },
    //获取需求工厂
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getScmAction(parmas1, "requirement/getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data
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
