<template>
  <div>
    <a-modal :title="isEdit ? '编辑联系人' : '添加联系人'" v-if="visible" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="姓名" prop="name">
          <a-input v-model="form.name" :disabled="isEdit" allowClear placeholder="请输入姓名" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="部门">
          <a-input v-model="form.department" allowClear placeholder="请输入部门" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="传真">
          <a-input v-model="form.fax" allowClear placeholder="请输入传真" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="联系电话">
          <a-input v-model="form.mobilephone" allowClear placeholder="请输入联系电话" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="手机" prop="phone">
          <a-input v-model="form.phone" allowClear placeholder="请输入手机" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="邮箱">
          <a-input v-model="form.email" allowClear placeholder="请输入邮箱" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="微信">
          <a-input v-model="form.wechat" allowClear placeholder="请输入车间名称" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setSupplierAction } from "@/services/srm.js";
export default {
  props: ["editData", "isEdit", "supplierId"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        supplierid: "",
        name: "",
        department: "",
        phone: "",
        isdefault: "",
        mobilephone: "",
        email: "",
        wechat: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              id: this.editData.Id,
              department: this.form.Department,
              phone: this.form.Phone,
              mobilephone: this.form.MobilePhone,
              email: this.form.Email,
              fax: this.form.Fax,
              wechat: this.form.Wechat,
            };
            setSupplierAction(editForm, "updatecontact").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            console.log("tianj");
            //添加
            this.form.supplierid = this.supplierId;
            setSupplierAction(this.form, "addcontact").then((res) => {
              console.log("11111");
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
