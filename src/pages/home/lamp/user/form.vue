<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-06 09:39:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/lamp/user/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑员工' : '添加员工'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="companyid" has-feedback label="公司" prop="EnterpriseId">
          <a-select v-model="form.EnterpriseId" :disabled="isEdit" has-feedback placeholder="请选择设公司名称">
            <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="员工姓名" prop="UserName">
          <a-input v-model="form.UserName" has-feedback placeholder="请输入员工姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-textarea v-model="form.Remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item label="是否启用">
          <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
            <a-radio-button value="N">否</a-radio-button>
            <a-radio-button value="Y">是</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setLampAction } from "@/services/web.js";
export default {
  props: ["editData", "isEdit", "enterList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EnterpriseId: "", //公司ID
        UserName: "", //部门名称
        Remark: "", //备注
        Enable: "Y",
      },
      rules: {
        EnterpriseId: [
          {
            required: true,
            message: "请选择公司",
            trigger: "blur",
          },
        ],
        UserName: [
          {
            required: true,
            message: "请输入用户名",
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
              UserName: this.form.UserName, //公司ID
              Remark: this.form.Remark, //部门名称
              Enable: this.form.Enable,
            };
            setLampAction(editForm, "employee/editemployee").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setLampAction(this.form, "employee/addemployee").then((res) => {
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
