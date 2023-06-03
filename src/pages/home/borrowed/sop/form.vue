<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-05-26 14:28:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/sop/form.vue
-->

<template>
  <div>
    <a-modal :title="!isOut?'借出':'归还'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item v-if="!isOut" has-feedback label="借出人" prop="BorrowUser">
          <a-input-search @click="showUser" v-model="form.BorrowUser" has-feedback placeholder="请选择借出人"></a-input-search>
        </a-form-model-item>
        <a-form-model-item v-else has-feedback label="归还人" prop="BorrowUser">
          <a-input-search  @click="showUser" v-model="form.BorrowUser" has-feedback placeholder="请选择归还人"></a-input-search>
        </a-form-model-item>
        <a-form-model-item v-if="!isOut" has-feedback label="借出时间" prop="Time">
          <a-date-picker show-time v-model="form.Time" has-feedback placeholder="请选择借出时间"></a-date-picker>
        </a-form-model-item>
        <a-form-model-item v-else has-feedback label="归还时间" prop="Time">
          <a-date-picker show-time v-model="form.Time" has-feedback placeholder="请选择归还时间"></a-date-picker>
        </a-form-model-item>
        <a-form-model-item has-feedback label="页数" prop="Pagination">
          <a-input-number :min="0" style="width:150px" v-model="form.Pagination" has-feedback placeholder="请输入页数"></a-input-number>
        </a-form-model-item>
        <a-form-model-item has-feedback label="备注" prop="Remark">
          <a-input v-model="form.Remark" has-feedback placeholder="请输入备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <UserList v-if="isUser" @closeModal="closeModal" :user="user" @okModal="setUserList" />
  </div>
</template>

<script>
import { setBorrowedSop } from "@/services/web.js";
import UserList from "@/components/app-user/UserList.vue";
export default {
  props: ["editData", "isOut", "enterList"],
  components: { UserList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        Time: "",
        Pagination: "",
        Remark: "", //备注
        BorrowUser: "",
      },
      rules: {
        Time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        BorrowUser: [
          {
            required: true,
            message: "请选择人员",
            trigger: "change",
          },
        ],
        Pagination: [
          {
            required: true,
            message: "请输入页数",
            trigger: "blur",
          },
        ],
      },
      userList: [],
      isUser: false,
      user: [],
    };
  },
  created() {
    if (!this.isOut) {
      this.form = { ...this.editData };
    }
  },
  methods: {
    showUser() {
      this.isUser = true;
    },
    setUserList(list) {
      this.user = list;
      this.form.BorrowUser = list.Name;
      this.isUser = false;
    },
    closeModal() {
      this.isUser = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {};
          if (!this.isOut) {
            params = {
              borrowid: this.editData.Id,
              borrowtime: this.form.Time,
              borrowpagecount: this.form.Pagination,
              borrowremark: this.form.Remark,
              borrowuser: this.user.Code,
            };
          } else {
            params = {
              borrowid: this.editData.Id,
              returntime: this.form.Time,
              returnpagecount: this.form.Pagination,
              returnremark: this.form.Remark,
              returnuser: this.user.Code,
            };
          }
          setBorrowedSop(params, this.isOut ? "return" : "borrow").then((res) => {
            if (res.data.success) {
              this.$message.success(this.isOut ?"归还成功!":"借出成功!");
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
