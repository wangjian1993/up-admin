<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-06 10:35:32
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/quality/testItem/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑测试项目' : '添加测试项目'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="companyid" has-feedback label="业务公司" prop="EnterId">
          <a-select v-model="form.EnterId" :disabled="isEdit" has-feedback placeholder="请选择业务公司">
            <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="companyid" has-feedback label="测试项目类型" prop="TypeCode">
          <a-select v-model="form.TypeCode" :disabled="isEdit" placeholder="请选择测试项目类型">
            <a-select-option v-for="item in paramsItem" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试项目编码" prop="ItemCode">
          <a-input v-model="form.ItemCode" :disabled="isEdit" has-feedback placeholder="请输入测试项目编码"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试项目名称" prop="ItemName">
          <a-input v-model="form.ItemName" has-feedback placeholder="请输入测试项目名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="测试项目描述">
          <a-textarea v-model="form.ItemDesc" placeholder="请输入测试项目描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item label="是否启用">
          <a-radio-group :value="form.IsEnable" button-style="solid" @change="enableChange">
            <a-radio-button value="N">否</a-radio-button>
            <a-radio-button value="Y">是</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setTestItem } from "@/services/qms.js";
export default {
  props: ["editData", "isEdit", "enterList" ,'paramsItem'],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EnterId: "", 
        TypeCode: "",
        ItemCode: "",
        ItemName:"",
        ItemDesc:"",
        IsEnable: "Y",
      },
      rules: {
        EnterId: [
          {
            required: true,
            message: "请选择业务公司",
            trigger: "blur",
          },
        ],
        TypeCode: [
          {
            required: true,
            message: "请选择测试类型",
            trigger: "blur",
          },
        ],
        ItemCode: [
          {
            required: true,
            message: "请输入测试项目编码",
            trigger: "blur",
          },
        ],
        ItemName: [
          {
            required: true,
            message: "请输入测试项目名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.form = {...this.editData};
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
      this.form.IsEnable = value.target.value;
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
              ItemName: this.form.ItemName, //公司ID
              ItemDesc: this.form.ItemDesc, //部门名称
              IsEnable: this.form.IsEnable,
            };
            setTestItem(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setTestItem(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
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
