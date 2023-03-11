<!--
 * @Author: max
 * @Date: 2022-05-05 11:32:20
 * @LastEditTime: 2023-03-10 15:21:48
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/quality/incomingInspection/editForm.vue
-->
<template>
  <div>
    <a-modal title="编辑来料检测" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="业务公司">
          {{ form.CompanyName }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="PO号">
          {{ form.PuchaseOrderNo }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="供应商">
          {{ form.SupplierFullName }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="品号">
          {{ form.ItemCode }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="品名">
          {{ form.ItemDescription }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="规格">
          {{ form.ItemSpecification }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="来料数量">
          {{ form.Qty }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试项目" prop="TestItem">
          <a-select v-model="form.TestItem" :disabled="isEdit" placeholder="请选择测试项目">
            <a-select-option v-for="item in paramsItem.IQC_INCOMING_TEST_ITEM" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试结果" prop="TestResult">
          <a-select v-model="form.TestResult" :disabled="isEdit" placeholder="请选择测试结果">
            <a-select-option v-for="item in paramsItem.IQC_INCOMING_TEST_ITEM_RESULT" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="备注" prop="Remarks">
          <a-textarea v-model="form.Remarks" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setIncomingTest } from "@/services/qms.js";
export default {
  props: ["editData", "isEdit", "paramsItem"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        CompanyName: "",
        DocNo: "",
        ItemCode: "",
        ItemDescription: "",
        ItemSpecification: "",
        PuchaseOrderNo: "",
        Qty: "",
        SupplierCode: "",
        SupplierFullName: "",
        Unit: "",
        TestItem: "",
        TestResult: "",
        id: "",
        Remarks: "",
      },
    };
  },
  created() {
    this.form = { ...this.editData };
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log("this.form===",this.form)
          let editForm = {
            Id: this.form.id,
            TestItem: this.form.TestItem,
            TestResult: this.form.TestResult,
            Remarks: this.form.Remarks || "",
          };
          setIncomingTest(editForm, "multiple/update").then((res) => {
            if (res.data.success) {
              this.$message.success("编辑成功!");
              this.$emit("closeModal");
              this.$emit("success");
              this.visible = false;
            }
          });
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
