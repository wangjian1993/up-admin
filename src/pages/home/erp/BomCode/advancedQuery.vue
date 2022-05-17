<template>
  <div>
    <a-modal title="高级查询" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="40%">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EnterpriseId" has-feedback label="品号" prop="EnterpriseId">
          <a-input style="width: 200px" v-model="form.SortNumber" allowClear placeholder="请输入品号" />
        </a-form-model-item>
        <a-form-model-item ref="DepartmentName" has-feedback label="品名" prop="DepartmentName">
          <a-input style="width: 200px" v-model="form.SortNumber" allowClear placeholder="请输入品名" />
        </a-form-model-item>
        <a-form-model-item ref="DepartmentName" has-feedback label="规格" prop="DepartmentName">
          <a-input style="width: 200px" v-model="form.SortNumber" allowClear placeholder="请输入规格" />
        </a-form-model-item>
        <a-form-model-item ref="DepartmentName" has-feedback label="长" prop="DepartmentName">
          <a-input-number :min="0" style="width: 100px" v-model="form.SortNumber" allowClear placeholder="请输入长" />
        </a-form-model-item>
        <a-form-model-item ref="DepartmentName" has-feedback label="宽" prop="DepartmentName">
          <a-input-number :min="0" style="width: 100px" v-model="form.SortNumber" allowClear placeholder="请输入宽" />
        </a-form-model-item>
        <a-form-model-item ref="DepartmentName" has-feedback label="高" prop="DepartmentName">
          <a-input-number :min="0" style="width: 200px" v-model="form.SortNumber" allowClear placeholder="请输入高" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getMaterialSampleApi, setDepartmentApi } from "@/services/web.js";
export default {
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EnterpriseId: "", //公司ID
        DepartmentName: "", //部门名称
        ReceiverList: [],
        SortNumber: "", //排序
        Remark: "", //备注
        Enable: "Y",
      },
      rules: {
        EnterpriseId: [
          {
            required: true,
            message: "请选择公司名称",
            trigger: "blur",
          },
        ],
        DepartmentName: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur",
          },
        ],
      },
      departmentalList: [],
      isUser: false,
      user: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
      this.editData.ReceiverList.forEach((item) => {
        this.user.push({
          Name: item.ReceiverName,
          Id: item.ReceiverId,
          Code: item.ReceiverCode,
        });
      });
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
    enterChange(e) {
      let params = {
        enterpriseid: e,
      };
      getMaterialSampleApi(params, "getdeptoptions").then((res) => {
        if (res.data.success) {
          this.departmentalList = res.data.data;
        }
      });
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            if (this.user.length == 0) {
              this.$message.warning("请先添加接收人!");
            }
            let editForm = {
              DepartmentId: this.form.DepartmentId, //部门ID
              DepartmentName: this.form.DepartmentName, //部门名称
              ReceiverList: [],
              SortNumber: this.form.SortNumber, //排序
              Remark: this.form.Remark, //备注
              Enable: this.form.Enable,
            };
            this.user.forEach((item) => {
              editForm.ReceiverList.push({
                ReceiverId: item.Id, //接收人ID
                ReceiverCode: item.Code, //接收人工号
                ReceiverName: item.Name, //接收人名称
              });
            });
            setDepartmentApi(editForm, "editdept").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            this.user.forEach((item) => {
              this.form.ReceiverList.push({
                ReceiverId: item.Id, //接收人ID
                ReceiverCode: item.Code, //接收人工号
                ReceiverName: item.Name, //接收人名称
              });
            });
            setDepartmentApi(this.form, "adddept").then((res) => {
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
