<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-05-12 10:14:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/engineering/drawings/form.vue
-->

<template>
  <div>
    <a-modal title="更新图纸信息" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :rules="rules" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="公司">
          <span>{{ editData.CompanyName }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="物料号">
          <span>{{ editData.MitemCode }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="物料图纸名">
          <span>{{ editData.MitemCode }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="图号">
          <span>{{ editData.DrawingNo }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="设计者" prop="UserNameDesigner">
          <a-input placeholder="请选择设计者" disabled allowClear style="width: 150px" v-model="form.UserNameDesigner" />
          <a-button @click="userSearch" style="margin-left: 8px" shape="circle" icon="search" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="发行时间">
          <a-date-picker show-time v-model="form.DatetimeIssued" has-feedback placeholder="请选择发行时间"></a-date-picker>
        </a-form-model-item>
        <a-form-model-item has-feedback label="创建人">
          <span>{{ editData.UserNameCreatedErp }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="创建时间">
          <span>{{ editData.DatetimeCreatedErp }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="修改人">
          <span>{{ editData.UserNameModifiedErp }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="修改时间">
          <span>{{ editData.DatetimeModifiedErp }}</span>
        </a-form-model-item>
      </a-form-model>
      <user-list v-if="isUserList" @closeModal="closeModal" @okModal="okUserModal"></user-list>
    </a-modal>
  </div>
</template>

<script>
import { setEngineering } from "@/services/erp.js";
import UserList from "@/components/app-user/UserList";
export default {
  props: ["editData", "isEdit", "enterList"],
  components: { UserList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      isUserList: false,
      userItem: [],
      userName: "",
      form: {
        UserNameDesigner: "", //公司ID
        DatetimeIssued:"",
      },
      rules: {
        UserNameDesigner: [
          {
            required: true,
            message: "请选择设计者",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.form = { ...this.editData };
    this.userItem = {
      Id: this.editData.UserDesigner,
      Name: this.editData.UserNameDesigner,
    };
  },
  methods: {
    userSearch() {
      this.isUserList = true;
    },
    okUserModal(item) {
      this.isUserList = false;
      this.userItem = item;
      this.form.UserNameDesigner = item.Name;
      console.log("item===", item);
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUserList = false;
    },
    setUserList(list) {
      this.user = list;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            Id: this.editData.Id,
            UserDesigner: this.userItem.Id,
            UserNameDesigner: this.userItem.Name,
            DatetimeIssued:this.form.DatetimeIssued
          };
          setEngineering(params, "update").then((res) => {
            if (res.data.success) {
              this.$message.success("更新成功!");
              this.$emit("closeModal");
              this.$emit("success");
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
