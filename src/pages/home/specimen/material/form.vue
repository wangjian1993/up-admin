<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-05-18 09:44:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/material/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑物料权限' : '添加物料权限'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EnterpriseId" has-feedback label="公司名称" prop="EnterpriseId">
          <a-select v-model="form.EnterpriseId" :disabled="isEdit" has-feedback placeholder="请选择设公司名称" @change="enterChange">
            <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="DepartmentId" has-feedback label="部门名称" prop="DepartmentId">
          <a-select v-model="form.DepartmentId" :disabled="isEdit" has-feedback placeholder="请选择设公司名称">
            <a-select-option v-for="item in departmentalList" :key="item.Id" :value="item.Id">{{ item.DepartmentName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="MaterialPrefix" has-feedback label="物料编码范围" prop="MaterialPrefix">
          <a-select v-model="form.MaterialPrefix" mode="tags" placeholder="输入物料编码" style="width: 200px"> </a-select>
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
        MaterialPrefix: [],
        PermissionUserList: [],
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
      this.form = JSON.parse(JSON.stringify(this.editData));
      this.form.MaterialPrefix = this.editData.MaterialPrefix.split(",");
      this.enterChange(this.form.EnterpriseId);
      this.editData.PermissionUserList.forEach((item) => {
        this.user.push({
          Name: item.UserName,
          Id: item.UserId,
          Code: item.UserCode,
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
              PermissionId: this.form.PermissionId, //部门ID
              PermissionUserList: [],
              MaterialPrefix: "",
              SortNumber: this.form.SortNumber, //排序
              Remark: this.form.Remark, //备注
              Enable: this.form.Enable,
            };
            this.user.forEach((item) => {
              editForm.PermissionUserList.push({
                UserId: item.Id, //接收人ID
                UserCode: item.Code, //接收人工号
                UserName: item.Name, //接收人名称
              });
            });
            editForm.MaterialPrefix = this.form.MaterialPrefix.join(",");
            setDepartmentApi(editForm, "editpermission").then((res) => {
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
              this.form.PermissionUserList.push({
                UserId: item.Id, //接收人ID
                UserCode: item.Code, //接收人工号
                UserName: item.Name, //接收人名称
              });
            });
            this.form.MaterialPrefix = this.form.MaterialPrefix.join(",");
            setDepartmentApi(this.form, "addpermission").then((res) => {
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
