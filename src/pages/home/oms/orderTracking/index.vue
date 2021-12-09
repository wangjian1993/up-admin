<!--
 * @Author: max
 * @Date: 2021-11-25 15:02:21
 * @LastEditTime: 2021-12-09 14:29:46
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="订单跟踪预处理" v-if="hasPerm('order_tracking_tab2')">
        <Pretreatment  @toDetail="toDetail" :companyList="companyList" :plantList="plantList" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="未产订单跟踪" v-if="hasPerm('order_tracking_tab1')">
        <NoOrderTracking :companyList="companyList" :plantList="plantList" ref="myDeatils"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import NoOrderTracking from "./NoOrderTracking.vue";
import Pretreatment from "./Pretreatment.vue";
import { getOrderApi } from "@/services/web.js";
export default {
  components: { NoOrderTracking,Pretreatment},
  data() {
    return {
      activeKey: "1",
      batchid: "",
      companyList: [],
      plantList: [],
    };
  },
  created() {
    this.getCompany();
    this.getPlant();
  },
  methods: {
    toDetail(id) {
      this.batchid = id;
      this.activeKey = "2";
      console.log("1111")
      // this.$nextTick(() => {
      //   this.$refs.myDeatils.getListAll();
      // });
    },
    callback(key) {
      this.activeKey = key;
    },
    getCompany() {
      let parmas1 = {
        entertypecode: "COMPANY",
      };
      getOrderApi(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.companyList = res.data.data;
        }
      });
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getOrderApi(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
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
