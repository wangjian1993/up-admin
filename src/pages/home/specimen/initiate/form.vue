<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-05-27 16:43:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/initiate/form.vue
-->

<template>
  <div>
    <a-modal title="发起填表" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EnterpriseId" has-feedback label="公司名称" prop="EnterpriseId">
          <a-input v-model="form.EnterpriseName" :disabled="isEdit" allowClear placeholder="请输入条件" />
        </a-form-model-item>
        <a-form-model-item ref="DepartmentId" has-feedback label="发起部门" prop="DepartmentId">
          <a-input v-model="form.DepartmentName" :disabled="isEdit" allowClear placeholder="请输入条件" />
        </a-form-model-item>
        <a-form-model-item ref="Condition" has-feedback label="条件">
          <a-input v-model="form.Condition" :disabled="isEdit" allowClear placeholder="请输入条件" />
        </a-form-model-item>
        <a-form-model-item ref="Remark" label="发起人备注">
          <a-textarea v-model="form.Remark" placeholder="请输入发起人备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getMaterialSampleApi, setDepartmentApi } from "@/services/web.js";
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
        DepartmentId: "", //部门名称
        Condition: "",
        Remark: "", //备注
      },
      rules: {
        EnterpriseId: [
          {
            required: true,
            message: "请选择公司名称",
            trigger: "blur",
          },
        ],
        DepartmentId: [
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
      dynamicValidateForm: [],
      addUserIndex: -1,
      rawData: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.form = JSON.parse(JSON.stringify(this.editData));
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    //选择用户
    setUserList(list) {
      // this.user = list;
      this.dynamicValidateForm[this.addUserIndex].recipient = list;
      console.log(" this.dynamicValidateForm", this.dynamicValidateForm);
    },
    //tag删除用户
    handleClose(id, index) {
      let list = this.dynamicValidateForm[index].recipient;
      this.dynamicValidateForm[index].recipient = list.filter((item) => item.Id != id);
    },
    //添加用户按钮
    addUser(index) {
      this.isUser = true;
      this.addUserIndex = index;
      this.user = this.dynamicValidateForm[this.addUserIndex].recipient;
    },
    departmentChange(e, index) {
      console.log(e);
      console.log(index);
      let params = {
        departmentid: e,
      };
      getMaterialSampleApi(params, "getdeptsingle").then((res) => {
        if (res.data.success) {
          let list = res.data.data.ReceiverList;
          list.forEach((item) => {
            this.dynamicValidateForm[index].recipient.push({
              Id: item.ReceiverId,
              Code: item.ReceiverCode,
              Name: item.ReceiverName,
            });
          });
        }
      });
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    removeDomain(item) {
      console.log(item);
      let index = this.dynamicValidateForm.indexOf(item);
      this.rawData.forEach((i) => {
        if (item.department.PointId == i.PointId) {
          i.IsDel = "Y";
        }
      });
      console.log(this.rawData);
      if (index !== -1) {
        this.dynamicValidateForm.splice(index, 1);
      }
    },
    addDomain() {
      if (this.form.EnterpriseId == "") {
        this.$message.warning("请先选择公司");
        return;
      }
      this.dynamicValidateForm.push({
        department: {
          value: "",
          key: Date.now(),
        },
        recipient: [],
      });
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
          let parmas = {
            FlowId: this.form.FlowId, //流程ID
            Remark: this.form.Remark, //发起人备注
          };
          setDepartmentApi(parmas, "addregister").then((res) => {
            if (res.data.success) {
              this.$message.success("发起成功!");
              this.$emit("closeModal");
              this.$emit("success");
              this.visible = false;
              this.$store.dispatch('specimen/registerIdActions',res.data.data.RegisterId)
              this.$router.push({ path: "/specimen/backlog"})
              // console.log("dispatch", this.$store.dispatch('specimen/registerIdActions'))
              // this.$router.push({ name: '待办事宜', params: { id:res.data.data.RegisterId } })
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
