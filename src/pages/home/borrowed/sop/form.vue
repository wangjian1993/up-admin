<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-25 15:39:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/sop/form.vue
-->

<template>
  <div>
    <a-modal title="借出" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="借出时间" prop="DatetimeLend">
          <a-date-picker show-time  v-model="form.DatetimeLend" has-feedback placeholder="请选择借出时间"></a-date-picker>
        </a-form-model-item>
        <a-form-model-item has-feedback label="归还时间">
          <a-date-picker show-time v-model="form.DatetimeReturn" has-feedback placeholder="请选择归还时间"></a-date-picker>
        </a-form-model-item>
        <a-form-model-item has-feedback label="备注" prop="Remark">
          <a-input v-model="form.Remark" has-feedback placeholder="请输入备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setLampAction } from "@/services/web.js";
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
      rules: {
        UserLend: [
          {
            required: true,
            message: "请输入借出人",
            trigger: "blur",
          },
        ],
      },
      userList:[]
    };
  },
  created() {
    this.getUserList();
    if (!this.isOut) {
      this.form = { ...this.editData };
    }
  },
  methods: {
    closeModal() {
      this.isUser = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let editForm = {
            Id: this.editData.Id, //灯板钢网ID
            ...this.form,
          };
          setLampAction(editForm, "lendlpsm").then((res) => {
            if (res.data.success) {
              this.$message.success("借出成功!");
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
