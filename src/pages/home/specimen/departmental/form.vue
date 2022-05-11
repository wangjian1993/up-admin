<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-05-11 15:26:06
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/departmental/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑部门' : '添加部门'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EnterpriseId" has-feedback label="公司名称" prop="EnterpriseId">
          <a-select v-model="form.EnterpriseId" :disabled="isEdit" has-feedback placeholder="请选择设公司名称" @change="enterChange">
            <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="DepartmentName" has-feedback label="部门名称" prop="DepartmentName">
          <a-select v-model="form.DepartmentName" has-feedback placeholder="请选择设公司名称">
            <a-select-option v-for="item in departmentalList" :key="item.Id" :value="item.Id">{{ item.DepartmentName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="接收人">
          <div>
            <a-tag style="margin:4px 4px" v-for="item in user" :key="item.Id" closable @close="() => handleClose(item.Id)">
              {{ item.Name }}
            </a-tag>
          </div>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addUser"> <a-icon type="plus" /> 添加 </a-tag>
        </a-form-model-item>
        <a-form-model-item ref="SortNumber" has-feedback label="排序" prop="SortNumber">
          <a-input-number style="width: 200px" :min="0" v-model="form.SortNumber" allowClear placeholder="请输入排序" />
        </a-form-model-item>
        <a-form-model-item ref="Remark" label="备注">
          <a-textarea v-model="form.Remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item ref="Enable" label="是否启用">
          <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
            <a-radio-button value="N">否</a-radio-button>
            <a-radio-button value="Y">是</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <userList v-if="isUser" @closeModal="closeModal" :user="user" @success="setUserList" />
    </a-modal>
  </div>
</template>

<script>
import { getMaterialSampleApi, setDepartmentApi } from "@/services/web.js";
import userList from "../components/userList.vue";
export default {
  props: ["editData", "isEdit", "enterList"],
  components: { userList },
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
