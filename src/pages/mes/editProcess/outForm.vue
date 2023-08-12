<!--
 * @Author: max
 * @Date: 2021-11-13 10:30:21
 * @LastEditTime: 2023-06-20 14:47:30
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/editProcess/outForm.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="修改" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="24"
              ><a-form-model-item has-feedback label="生产工厂/车间"
                ><span>{{ editData.PlantName }}/{{ editData.WorkShopName }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="24"
              ><a-form-model-item has-feedback label="报工工序"
                ><span>{{ editData.ProcessName }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="24"
              ><a-form-model-item has-feedback label="报工工单"
                ><span>{{ editData.MoCode }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="24"
              ><a-form-model-item has-feedback label="出站数量"
                ><span>{{ editData.ReportQty }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="24"
              ><a-form-model-item has-feedback label="出站扣减数量" prop="EditQty"> <a-input-number v-model="form.EditQty" allowClear style="width: 300px" :min="0" placeholder="请输入出站扣减数量"/></a-form-model-item
            ></a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { editProductionF } from "@/services/mes.js";
export default {
  props: ["editData"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EditQty: 0,
      },
      rules: {
        EditQty: [
          {
            required: true,
            message: "请输入出站扣减数量",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.form = this.editData;
    });
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            ReportId: this.editData.ReportId,
            ReportQty: this.form.EditQty,
            ProcessId: this.editData.ProcessId,
          };
          editProductionF(params, "update").then((res) => {
            if (res.data.success) {
              this.$emit("closeModal");
              this.$emit("succeed");
              this.$message.success("编辑成功!");
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
