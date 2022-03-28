<!--
 * @Author: max
 * @Date: 2022-03-26 15:47:03
 * @LastEditTime: 2022-03-28 15:25:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/components/editForm.vue
-->
<template>
  <div>
    <a-modal title="编辑" :visible="visible" v-if="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="440">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="订单号" :labelCol="{ span: 6 }">
              <p>{{ editFormData.MoNo }}</p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item v-if="editType == 'discount'" label="折扣率" prop="ZkRate" :labelCol="{ span: 6 }">
              <a-input-number :min="0" :max="1" step="0.01" v-model="form.money" allowClear placeholder="请输入折扣率" />
            </a-form-model-item>
            <a-form-model-item v-else label="金额" prop="CrtAmt" :labelCol="{ span: 6 }">
              <a-input-number :min="0" v-model="form.money" allowClear placeholder="请输入金额" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { editDiscount ,editIntermediary } from "@/services/hp.js";
export default {
  props: ["editFormData", "editType"],
  data() {
    return {
      isEdit: false,
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        money: "",
      },
      rules: {
        money: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.editType == "discount") {
      this.form.money = this.editFormData.ZkRate;
      this.rules.money[0].message = "请输入折扣率";
    } else {
      this.form.money = this.editFormData.CrtAmt;
      this.rules.money[0].message = "请输入金额";
    }
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.editType == "discount") {
            let editForm = {
              ID: this.editFormData.Id,
              ZkRate: this.form.money,
            };
            editDiscount(editForm).then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
              }
            });
          } else {
            let editForm = {
              ID: this.editFormData.Id,
              CrtAmt: this.form.money,
            };
            editIntermediary(editForm).then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.$emit("close");
    },
  },
  components: {},
};
</script>

<style>
.ant-form-item {
  margin-bottom: 5px;
}
</style>
