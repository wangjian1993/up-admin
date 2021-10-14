<!--
 * @Author: max
 * @Date: 2021-09-23 15:09:41
 * @LastEditTime: 2021-10-14 17:32:01
 * @LastEditors: max
 * @Description: 手动匹配
 * @FilePath: /up-admin/src/pages/home/scm/masterPlan/Matching.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="手动匹配" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="BatchNo" has-feedback label="物料需求计划批次号" prop="BatchNo">
            <a-input v-model="form.BatchNo" disabled allowClear placeholder="请输入产线名称" style="width:200px" />
            <a-button type="primary" style="margin-left:5px" icon="search" @click="batchno">
              搜索
            </a-button>
          </a-form-model-item>
          <a-form-model-item ref="MitemCode" has-feedback label="物料编码" prop="MitemCode">
            <a-select v-model="form.MitemCode" placeholder="请选择物料编码" @change="mitemChange">
              <a-select-option v-for="item in materialData" :key="item.MitemCode" :value="item.MitemCode">{{ item.MitemCode }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item has-feedback label="物料名称">
            <span>{{ mitemData.MitemName }}</span>
          </a-form-model-item>
          <a-form-model-item ref="RequirementDate" has-feedback label="需求日期" prop="RequirementDate">
            <a-select v-model="form.RequirementDate" placeholder="请选择需求日期" @change="dateChange">
              <a-select-option v-for="(item, index) in materialDates" :key="index" :value="item.RequirementDate">{{ item.RequirementDate }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item has-feedback label="需求数量">
            <span>{{ mitemData.RequirementQty }}</span>
          </a-form-model-item>
          <a-form-model-item ref="PurchaseOrderNo" has-feedback label="采购订单" prop="PurchaseOrderNo">
            <a-input v-model="form.PurchaseOrderNo" allowClear placeholder="请选择采购订单" disabled style="width:200px" />
            <a-button type="primary" style="margin-left:5px" icon="search" @click="miitemOrder">
              搜索
            </a-button>
          </a-form-model-item>
          <a-form-model-item has-feedback label="负责采购">
            <span>{{ orderData.EmployeeName }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="供应商">
            <span>{{ orderData.SupplierName }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="订单行项目">
            <span>{{ orderData.LineItem }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="订单行项目号">
            <span>{{ orderData.lineItemNum }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="采购订单在途数量">
            <span>{{ orderData.QtyTransit }}</span>
          </a-form-model-item>
          <a-form-model-item ref="MatchQty" has-feedback label="采购订单匹配数量" prop="MatchQty">
            <a-input v-model="form.MatchQty" allowClear placeholder="请输入采购订单匹配数量" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <batch-no v-if="isBatchNo" :plantList="plantList" @closeModal="closeModal" @batchNoItem="batchNoItem"></batch-no>
    <mitem-order v-if="isOrder" :plantList="plantList" @closeModal="closeModal" @orderItem="orderItem" :MitemCode="mitemData.MitemCode"></mitem-order>
  </div>
</template>

<script>
import { getScmAction, setScmAction } from "@/services/web.js";
import BatchNo from "./BatchNo.vue";
import MitemOrder from "./MitemOrder.vue";
export default {
  components: { BatchNo, MitemOrder },
  props: ["plantList", "matchingData"],
  data() {
    return {
      size: "small",
      visible: true,
      isAddModal: false,
      columns: [],
      list: [],
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      form: {
        PlantId: "",
        BatchId: "",
        MitemCode: "",
        RequirementDate: "",
        PurchaseOrderNo: "",
        SupplierCode: "",
        LineItem: "",
        LineItemNum: "",
        MatchQty: 0,
      },
      rules: {
        RequirementDate: [
          {
            required: true,
            message: "请选择需求日期",
            trigger: "blur",
          },
        ],
        MatchQty: [
          {
            required: true,
            message: "请输入匹配数量",
            trigger: "blur",
          },
        ],
        PurchaseOrderNo: [
          {
            required: true,
            message: "请选择采购订单",
            trigger: "blur",
          },
        ],
        MitemCode: [
          {
            required: true,
            message: "请选择物料编码",
            trigger: "blur",
          },
        ],
        BatchNo: [
          {
            required: true,
            message: "请选择计划批次号",
            trigger: "blur",
          },
        ],
      },
      isBatchNo: false,
      isOrder: false,
      batchnoData: [],
      materialData: [],
      mitemData: [],
      materialDates: [],
      orderData: [],
    };
  },
  created() {
    console.log(this.matchingData);
    if (this.matchingData.BatchNo) {
      this.form.BatchNo = this.matchingData.BatchNo;
      this.form.BatchId = this.matchingData.Id;
      this.mitemData.MitemCode = this.matchingData.MitemCode;
      this.mitemData.MitemName = this.matchingData.MitemName;
      this.mitemData.RequirementQty = this.matchingData.RequirementQty;
      this.form.RequirementDate = this.matchingData.RequirementDate;
      this.batchnoData.BatchId = this.matchingData.Id;
      this.batchnoData.BatchNo = this.matchingData.BatchNo;
      this.batchnoData.PlantName = this.matchingData.PlantName;
      this.batchnoData.PlantId = this.matchingData.PlantId;
      console.log(this.mitemData);
      this.getMitemsByBatch();
    }
  },
  methods: {
    batchno() {
      this.isBatchNo = true;
    },
    miitemOrder() {
      this.isOrder = true;
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isBatchNo = false;
      this.isOrder = false;
    },
    //计划批次号
    batchNoItem(item) {
      this.batchnoData = item;
      this.isBatchNo = false;
      this.form.BatchNo = item.BatchNo;
      this.form.BatchId = item.BatchId;
      this.getMitemsByBatch();
    },
    //采购订单选择
    orderItem(item) {
      console.log(item);
      this.orderData = item;
      this.isOrder = false;
      this.form.PurchaseOrderNo = item.PurchaseOrderNo;
      this.form.SupplierCode = item.SupplierCode;
      this.form.LineItem = item.LineItem;
      this.form.LineItemNum = item.lineItemNum;
    },
    //获取物料信息
    getMitemsByBatch() {
      let parmas = {
        batchid: this.batchnoData.BatchId,
      };
      getScmAction(parmas, "manualmatch/getmitemsbybatch").then((res) => {
        if (res.data.success) {
          this.materialData = res.data.data;
        }
      });
    },
    getRequirementDates() {
      let parmas = {
        batchid: this.batchnoData.BatchId,
        mitemcode: this.mitemData.MitemCode,
      };
      getScmAction(parmas, "manualmatch/getrequirementdates").then((res) => {
        if (res.data.success) {
          this.materialDates = res.data.data;
          console.log(res.data.data)
        }
      });
    },
    //选择物料信息
    mitemChange(e) {
      this.mitemData = this.materialData.find((item) => (item.MitemCode = e));
      this.getRequirementDates();
    },
    dateChange(e) {
      this.mitemData = this.materialDates.find((item) => (item.RequirementDate == e));
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    handleOk() {
      let planid = this.plantList.find((item) => item.EnterName === this.batchnoData.PlantName);
      this.form.PlantId = planid.EnterId;
      setScmAction(this.form, "manualmatch/add").then((res) => {
        if (res.data.success) {
          this.$message.success("手动匹配成功!");
          this.$emit("succeed");
          this.$emit("closeModal");
        }
      });
    },
    reset() {
      this.getList();
      this.searchForm.resetFields();
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
  },
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
</style>
