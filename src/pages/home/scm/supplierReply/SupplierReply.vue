<!--
 * @Author: max
 * @Date: 2021-09-29 11:43:08
 * @LastEditTime: 2021-09-29 14:42:24
 * @LastEditors: max
 * @Description: 供应商回复
 * @FilePath: /up-admin/src/pages/home/scm/supplierReply/SupplierReply.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-spin :spinning="spinning">
      <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="供应商回复物料需求明细" v-if="hasPerm('supplier_tab1')">
          <detail :plantList="plantList" :batchid="batchid" ref="myDeatils"></detail>
        </a-tab-pane>
        <a-tab-pane key="2" tab="采购沟通差异交期" v-if="hasPerm('supplier_tab2')">
          <exception :plantList="plantList"></exception>
        </a-tab-pane>
        <a-tab-pane key="3" tab="采购物料需求总计划合并明细" v-if="hasPerm('supplier_tab3')">
          <detail-merge :plantList="plantList"></detail-merge>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-card>
</template>
<script>
import { getSupplierAction } from "@/services/web.js";
import Detail from "./Detail";
import Exception from "./Exception.vue";
import DetailMerge from "./DetailMerge.vue";
export default {
  components: { Detail, Exception, DetailMerge },
  data() {
    return {
      plantList: [],
      activeKey: "1",
      batchid: "",
      spinning:false
    };
  },
  created() {
    this.getPlant();
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
    //获取需求工厂
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getSupplierAction(parmas1, "reply/getlistbytypecode").then((res) => {
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
