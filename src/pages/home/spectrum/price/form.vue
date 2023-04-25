<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-14 13:38:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/spectrum/price/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑光源' : '添加员工'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="品牌" prop="Brand">
          <a-input v-model="form.Brand" has-feedback placeholder="请输入员工姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="品号" prop="ItemCode">
          <a-input v-model="form.ItemCode" disabled has-feedback placeholder="请输入员工姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="品名" prop="ItemName">
          <a-input v-model="form.ItemName" has-feedback placeholder="请输入员工姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="规格" prop="ItemSpecification">
          <a-textarea v-model="form.ItemSpecification" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="光源型号" prop="LightSpecification">
          <a-input v-model="form.LightSpecification" has-feedback placeholder="请输入员工姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="说明">
          <a-input v-model="form.Description" has-feedback placeholder="请输入员工姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="价格" prop="ItemPrice">
          <a-input-number v-model="form.ItemPrice" :min="0" has-feedback placeholder="请输入员工姓名"></a-input-number>
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-textarea v-model="form.Remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setSpectrumPrice } from "@/services/web.js";
export default {
  props: ["editData", "isEdit", "enterList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        Brand: "", //品牌
        ItemName: "", //品名
        ItemSpecification: "", //规格
        LightSpecification: "", //光源型号
        Description: "", //说明
        ItemPrice: 0, //价格
        Remark: "", //备注
      },
      rules: {
        Brand: [
          {
            required: true,
            message: "请输入品牌",
            trigger: "blur",
          },
        ],
        ItemName: [
          {
            required: true,
            message: "请输入品名",
            trigger: "blur",
          },
        ],
        ItemSpecification: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur",
          },
        ],
        LightSpecification: [
          {
            required: true,
            message: "请输入光源型号",
            trigger: "blur",
          },
        ],
        ItemPrice: [
          {
            required: true,
            message: "请输入价格",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.form = { ...this.editData };
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    setUserList(list) {
      this.user = list;
    },
    handleClose(id) {
      this.user = this.user.filter((item) => item.Id != id);
    },
    addUser() {
      this.isUser = true;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              Id: this.editData.Id, //部门ID
              Brand:this.form.Brand, //品牌
              ItemName: this.form.ItemName,
              ItemSpecification: this.form.ItemSpecification,
              LightSpecification: this.form.LightSpecification,
              Description: this.form.Description,
              ItemPrice: this.form.ItemPrice,
              Remark: this.form.Remark,
            };
            setSpectrumPrice(editForm, "submitedit").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          }
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
