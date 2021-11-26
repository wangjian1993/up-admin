<!--
 * @Author: max
 * @Date: 2021-11-25 15:02:21
 * @LastEditTime: 2021-11-25 15:23:26
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/index.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="未产订单跟踪" v-if="hasPerm('order_tracking_tab1')">
        <NoOrderTracking :companyList="companyList" :plantList="plantList" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="物料及采购明细" v-if="hasPerm('order_tracking_tab2')">
        <OrderDetail :companyList="companyList" :plantList="plantList" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import NoOrderTracking from "./NoOrderTracking.vue";
import OrderDetail from "./OrderDetail.vue";
import { getOrderApi } from "@/services/web.js";
export default {
  components: { NoOrderTracking, OrderDetail },
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
