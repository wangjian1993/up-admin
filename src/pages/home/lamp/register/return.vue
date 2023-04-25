<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-04 09:46:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/lamp/register/return.vue
-->

<template>
  <div>
    <a-modal title="归还" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="借出时间">
          <a-date-picker show-time :disabled="!isOut" v-model="form.DatetimeLend" has-feedback placeholder="请选择借出时间"></a-date-picker>
        </a-form-model-item>
        <a-form-model-item has-feedback label="借出人">
          <a-input v-model="form.UserLend" :disabled="!isOut" has-feedback placeholder="请输入规格/型号/版本"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="归还时间" prop="DatetimeReturn">
          <a-date-picker show-time v-model="form.DatetimeReturn" has-feedback placeholder="请选择归还时间"></a-date-picker>
        </a-form-model-item>
        <a-form-model-item has-feedback label="归还人" prop="UserReturn">
          <a-select v-model="form.UserReturn" has-feedback placeholder="请选择设公司名称">
            <a-select-option v-for="item in userList" :key="item.Id" :value="item.UserName">{{ item.UserName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="备注" prop="Remark">
          <a-input v-model="form.Remark" has-feedback placeholder="请输入备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setLampAction,getLampAction } from "@/services/web.js";
export default {
  props: ["editData", "isOut", "enterList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        DatetimeLend: "", //位号
        UserLend: "", //物料编码
        DatetimeReturn: "", //规格型号
        UserReturn: "", //尺寸
        Remark: "", //备注
      },
      userList:[],
      rules: {
        UserReturn: [
          {
            required: true,
            message: "请输入归还人",
            trigger: "blur",
          },
        ],
        DatetimeReturn: [
          {
            required: true,
            message: "请选择归还时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.form = { ...this.editData };
    this.getUserList();
  },
  methods: {
    closeModal() {
      this.isUser = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    getUserList() {
      let params = {
        pageindex: 1,
        pagesize: 100,
        enterpriseid:this.editData.EnterpriseId
      };
      getLampAction(params, "employee/getemployeelist").then((res) => {
        console.log("res---",res)
        if(res.data.success){
          this.userList = res.data.data.list
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
            let editForm = {
              Id: this.editData.Id, //灯板钢网ID
              DatetimeReturn: this.form.DatetimeReturn, //归还时间
              UserReturn: this.form.UserReturn, //归还人
              Remark: this.form.Remark,
            };
            setLampAction(editForm, "returnlpsm").then((res) => {
              if (res.data.success) {
                this.$message.success("归还成功!");
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
