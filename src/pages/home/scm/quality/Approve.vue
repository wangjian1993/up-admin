<!--
 * @Author: max
 * @Date: 2021-10-07 11:42:53
 * @LastEditTime: 2021-10-16 09:09:28
 * @LastEditors: max
 * @Description: 单个审批
 * @FilePath: /up-admin/src/pages/home/scm/quality/Approve.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="审批" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item has-feedback label="到货单后">
            <span>{{ approveData.OrderNo }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="生产工厂">
            <span>{{ approveData.PlantName }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="供应商">
            <span>{{ approveData.SupplierName }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="品号">
            <span>{{ approveData.MitemCode }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="品名">
            <span>{{ approveData.MitemName }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="到货数量">
            <span>{{ approveData.Qty }}</span>
          </a-form-model-item>
          <a-form-model-item has-feedback label="行项目">
            <span>{{ approveData.SequenceNumber }}</span>
          </a-form-model-item>
          <!-- <a-form-model-item ref="ReceivedQty" has-feedback label="到货数量" prop="ReceivedQty">
            <a-input-number v-model="form.ReceivedQty" style="width: 150px" :min="0" allowClear placeholder="请输入到货数量" />
          </a-form-model-item> -->
          <a-form-model-item ref="QTQty" has-feedback label="检验数量" prop="QTQty">
            <a-input-number v-model="form.QTQty" allowClear style="width: 150px" :min="0" placeholder="请输入检验数量" />
          </a-form-model-item>
          <a-form-model-item ref="QualifiedQty" has-feedback label="合格数量" prop="QualifiedQty">
            <a-input-number v-model="form.QualifiedQty" style="width: 150px" allowClear :min="0" placeholder="请输入合格数量" />
          </a-form-model-item>
          <a-form-model-item ref="ReturnQty" has-feedback label="退货数量" prop="ReturnQty">
            <a-input-number v-model="form.ReturnQty" style="width: 150px" allowClear :min="0" placeholder="请输入退货数量" />
          </a-form-model-item>
          <a-form-model-item ref="ScrapQty" has-feedback label="报废数量" prop="ScrapQty">
            <a-input-number v-model="form.ScrapQty" style="width: 150px" allowClear :min="0" placeholder="请输入报废数量" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { setQualityAction } from "@/services/web.js";
export default {
  props: ["approveData"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantCode: "",
        OrderNo: "",
        MitemCode: "",
        SequenceNumber: 0,
        QTQty: 0,
        QualifiedQty: 0,
        ReturnQty: 0,
        ScrapQty: 0,
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
    };
  },
  created() {},
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.form.PlantCode = this.approveData.PlantCode;
      this.form.OrderNo = this.approveData.OrderNo;
      this.form.MitemCode = this.approveData.MitemCode;
      this.form.SequenceNumber =this.approveData.SequenceNumber;
      setQualityAction(this.form, "approved").then((res) => {
        if (res.data.success) {
          this.$message.success("审核成功!");
          this.$emit("succeed");
          this.$emit("closeModal");
        }
      });
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
/deep/.ant-form-item {
  margin-bottom: 5px;
}
</style>
