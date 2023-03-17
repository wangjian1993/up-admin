<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-03-17 11:29:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/address/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑地址' : '添加地址'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="companyid" has-feedback label="点单公司" prop="companyid">
          <a-select v-model="form.companyid" :disabled="isEdit" has-feedback placeholder="请选择设公司名称">
            <a-select-option v-for="item in enterList" :key="item.Id" :value="item.Id">{{ item.CompanyName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="点单地址类型" prop="type">
          <a-select v-model="form.type" :disabled="isEdit" has-feedback placeholder="请选择点单地址类型">
            <a-select-option v-for="item in paramsItem.ADDRESS_TYPE" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="点单地址" prop="place">
          <a-input v-model="form.place" has-feedback placeholder="请输入点单地址"></a-input>
        </a-form-model-item>
        <a-form-model-item label="点单地点地址">
          <a-textarea v-model="form.address" placeholder="请输入点单地点地址" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item label="点单人">
          <div>
            <a-tag style="margin:4px 4px" v-for="item in user" :key="item.Id" closable @close="() => handleClose(item.Id)">
              {{ item.Name }}
            </a-tag>
          </div>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addUser"> <a-icon type="plus" /> 添加 </a-tag>
        </a-form-model-item>
        <a-form-model-item label="是否启用">
          <a-radio-group :value="form.enable" button-style="solid" @change="enableChange">
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
import { setOrderAddress } from "@/services/ors.js";
import userList from "../components/userList.vue";
export default {
  props: ["editData", "isEdit", "enterList", "paramsItem"],
  components: { userList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        companyid: "", //公司ID
        type: "", //部门名称
        userids: [],
        place: "", //排序
        address: "", //备注
        enable: "Y",
      },
      rules: {
        companyid: [
          {
            required: true,
            message: "请选择公司",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择地址类型",
            trigger: "blur",
          },
        ],
        place: [
          {
            required: true,
            message: "请输入地址",
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
      this.form.companyid = this.editData.CompanyId;
      this.form.place = this.editData.Place;
      this.form.type = this.editData.Type;
      this.form.address = this.editData.Address;
      this.form.enable = this.editData.Enable ? "Y" : "N";
      this.editData.Users.forEach((item) => {
        this.user.push({
          Name: item.UserName,
          Id: item.Id,
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
            console.log("this.form===",this.form)
            let editForm = {
              id: this.editData.Id, //部门ID
              companyid: this.form.companyid, //公司ID
              type: this.form.type, //部门名称
              userids: [],
              place: this.form.place, //排序
              address: this.form.address, //备注
              enable: this.form.enable == "Y" ? true : false,
            };
            console.log("this.user===", this.user);
            this.user.forEach((item) => {
              editForm.userids.push(item.Id);
            });
            setOrderAddress(editForm, "update").then((res) => {
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
              this.form.userids.push(item.Id);
            });
            this.form.enable = this.form.enable == "Y" ? true : false;
            setOrderAddress(this.form, "add").then((res) => {
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
