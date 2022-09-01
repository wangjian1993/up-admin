<!--
 * @Author: max
 * @Date: 2021-09-30 09:52:45
 * @LastEditTime: 2021-10-14 15:37:28
 * @LastEditors: max
 * @Description: 调整供应商交期
 * @FilePath: /up-admin/src/pages/home/scm/supplierReply/AdjustDate.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="调整供应商交期" @cancel="close" @ok="handleOk" centered width="600px">
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-row>
            <a-col :span="24" class="adjust-box">
              <span>物料需求计划批次号:</span>
              <span>{{ adjustData.BatchNo }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>物料编码:</span>
              <span>{{ adjustData.MitemCode }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>物料名称:</span>
              <span>{{ adjustData.MitemName }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>需求日期:</span>
              <span>{{ adjustData.RequirementDate }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>需求数量:</span>
              <span>{{ adjustData.RequirementQty }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>采购订单:</span>
              <span>{{ adjustData.PurchaseOrderNo }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>负责采购:</span>
              <span>{{ adjustData.PurchaseUserName }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>采购订单数量:</span>
              <span>{{ adjustData.TransitQty }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>供应商:</span>
              <span>{{ adjustData.SupplierName }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>供应商回复日期:</span>
              <span>{{splitData( adjustData.SupplierReplyDate) }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>供应商回复数量:</span>
              <span>{{ adjustData.SupplierReplyQty }}</span>
            </a-col>
            <a-col :span="24" class="adjust-box">
              <span>调整交期:</span>
              <span><a-date-picker @change="onChange"/></span>
            </a-col>
          </a-row>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { setSupplierAction } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
export default {
  props: ["adjustData"],
  data() {
    return {
      size: "small",
      visible: true,
      columns: [],
      pagination: false,
      loading: false,
      list: [],
      dateString:""
    };
  },
  created() {
    console.log(this.adjustData);
  },
  methods: {
    splitData,
    close() {
      this.$emit("closeModal");
    },
    onChange(date, dateString) {
      console.log(dateString);
      this.dateString =dateString
    },
    //关闭对话框
    handleOk() {
      let params = {
        BatchId: this.adjustData.BatchId,
        DetailId: this.adjustData.DetailId,
        PurchaseId: this.adjustData.PurchaseId,
        PurchaseChangeDate: this.dateString,
      };
      setSupplierAction(params, "reply/changedeliverydate").then((res) => {
        if (res.data.success) {
          this.$message.success("调整供应商交期成功!");
          this.$emit("closeModal");
        }
      });
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/.ant-table {
  min-height: 0vh;
}
.adjust-box {
  span {
    display: inline-block;
    font-size: 14px;
    color:@text-color;
    padding: 5px 0;
    &:nth-of-type(1) {
      width: 200px;
      text-align: right;
      padding-right: 5px;
    }
  }
}
</style>
