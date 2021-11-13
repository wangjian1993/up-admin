<!--
 * @Author: max
 * @Date: 2021-11-13 10:30:21
 * @LastEditTime: 2021-11-13 15:59:20
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/remarks.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="编辑" @cancel="close" @ok="handleOk" centered width="45%">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="生产工厂">
                <span>{{ editData.PlantName }}</span>
              </a-form-model-item></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="计划生产日期"
                ><span>{{ editData.PlanDate }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="生产车间">
                <span>{{ editData.WorkShopName }}</span>
              </a-form-model-item></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="订单交期"
                ><span>{{ editData.OrderDate }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="生产产线">
                <span>{{ editData.LineName }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="下单日期"
                ><span>{{ editData.OrderQty }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="工单号"
                ><span>{{ editData.WorkOrderNo }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="订单数量"
                ><span>{{ editData.OrderQty }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="品号"
                ><span>{{ editData.MitemCode }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="计划数量"
                ><span>{{ editData.PlanQty }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="品名"
                ><span>{{ editData.MitemName }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="人均标准产能"
                ><span>{{ editData.PerCapitaCapacity }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="工时"
                ><span>{{ editData.WorkHour }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="物料库存情况"
                ><span>{{ editData.PlanQty }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="备注"
                ><span>{{ editData.Remarks }}</span></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="状态"
                ><span>{{ editData.StatusName }}</span></a-form-model-item
              ></a-col
            >
          </a-row>
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="生产备注" prop="ProductRemarks"><a-textarea style="width:300px" v-model="form.ProductRemarks" placeholder="请输入生产备注" allow-clear/></a-form-model-item
            ></a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {setDailyPlanAction } from "@/services/web.js";
export default {
  props: ["editData"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: { ProductRemarks: "" },
      rules: {
        ProductRemarks: [
          {
            required: true,
            message: "请输入生产备注",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    console.log(this.editData);
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.Id = this.editData.Id;
          setDailyPlanAction(this.form, "kanban/update").then((res) => {
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
