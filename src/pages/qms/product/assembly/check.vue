<!--
 * @Author: max
 * @Date: 2021-11-13 10:30:21
 * @LastEditTime: 2023-05-12 14:55:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/product/assembly/check.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="审核" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-form-model-item has-feedback label="生产产线">
              <span>{{ editData.PlantName }}/{{ editData.WorkShopName }}/{{ editData.LineName }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="订单号">
              <span>{{ editData.OrderNo }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="工单号">
              <span>{{ editData.MoCode }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="品号">
              <span>{{ editData.ProCode }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="品名">
              <span>{{ editData.ProName }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="工序">
              <span>{{ editData.ProcessName }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="首件检测人">
              <span>{{ editData.UserIdInspect }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="首件检测时间">
              <span>{{ editData.DateTimeInspect }}</span>
            </a-form-model-item>
            <a-form-model-item has-feedback label="首件检测结果">
              <span>{{ editData.InspectResult === "OK" ? "合格" : "不合格" }}</span>
            </a-form-model-item>
            <a-col :span="24"
              ><a-form-model-item label="首件检测结果审核" prop="Status">
                <a-select v-model="form.Status" placeholder="请选择首件检测结果">
                  <a-select-option v-for="item in paramsItem" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { setProductAssembly } from "@/services/qms.js";
export default {
  props: ["editData", "paramsItem"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        Status: "",
      },
      rules: {
        Status: [
          {
            required: true,
            message: "请选择检测结果",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.form.Status = this.editData.Status === "UNAUDITED" ? "" : this.editData.Status;
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            Id: this.editData.Id,
            Status: this.form.Status,
          };
          setProductAssembly(params, "approve").then((res) => {
            if (res.data.success) {
              this.$emit("closeModal");
              this.$emit("success");
              this.$message.success("审核成功!");
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
