<!--
 * @Author: max
 * @Date: 2022-03-26 15:47:03
 * @LastEditTime: 2022-03-29 18:01:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/components/editForm.vue
-->
<template>
  <div>
    <a-modal title="编辑" :visible="visible" v-if="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="440">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24" v-if="editType != 'monthTask' && editType != 'finishing'">
            <a-form-model-item label="订单号" :labelCol="{ span: 6 }">
              <p>{{ editFormData.MoNo }}</p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="editType == 'monthTask' || editType == 'finishing'">
            <a-form-model-item label="业务员" :labelCol="{ span: 6 }">
              <p>{{ editFormData.EmployeeName }}</p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="editType == 'monthTask' || editType == 'finishing'">
            <a-form-model-item label="工号" :labelCol="{ span: 6 }">
              <p>{{ editFormData.EmployeeCode }}</p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="editType == 'monthTask'">
            <a-form-model-item label="年度" :labelCol="{ span: 6 }">
              <p>{{ editFormData.TheYear }}</p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="editType == 'monthTask'">
            <a-form-model-item label="月份" :labelCol="{ span: 6 }">
              <p>{{ editFormData.TheMonth }}</p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item v-if="editType == 'discount'" label="折扣率" prop="money" :labelCol="{ span: 6 }">
              <a-input-number :min="0" :max="1" step="0.01" v-model="form.money" allowClear placeholder="请输入折扣率" />
            </a-form-model-item>
            <a-form-model-item v-if="editType == 'intermediary'" label="金额" prop="money" :labelCol="{ span: 6 }">
              <a-input-number :min="0" v-model="form.money" allowClear placeholder="请输入金额" />
            </a-form-model-item>
            <a-form-model-item v-if="editType == 'monthTask'" label="月任务" prop="money" :labelCol="{ span: 6 }">
              <a-input-number :min="0" v-model="form.money" allowClear placeholder="请输入月任务" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="editType == 'finishing'">
            <a-form-model-item label="完成率起始" prop="RateStart" :labelCol="{ span: 6 }">
              <a-input-number :min="0" :max="1" step="0.01" v-model="form.RateStart" allowClear placeholder="请输入完成率起始" />
            </a-form-model-item>
            <a-form-model-item label="完成率至" prop="RateEnd" :labelCol="{ span: 6 }">
              <a-input-number :min="0" :max="1" step="0.01" v-model="form.RateEnd" allowClear placeholder="请输入完成率至" />
            </a-form-model-item>
            <a-form-model-item label="月度任务完成率" prop="TaskTcRate" :labelCol="{ span: 6 }">
              <a-input-number :min="0" :max="1" step="0.01" v-model="form.TaskTcRate" allowClear placeholder="请输入月度任务完成率" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { editDiscount, editIntermediary, editMonthlyTask ,editFinishing} from "@/services/hp.js";
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
        RateStart: "0",
        RateEnd: "0",
        TaskTcRate: "0",
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
    // monthTask
    if (this.editType == "discount") {
      this.form.money = this.editFormData.ZkRate;
      this.rules.money[0].message = "请输入折扣率";
    } else if (this.editType == "intermediary") {
      this.form.money = this.editFormData.CrtAmt;
      this.rules.money[0].message = "请输入金额";
    } else if (this.editType == "monthTask") {
      this.form.money = this.editFormData.MonthTask;
      this.rules.money[0].message = "请输入月任务";
    } else if (this.editType == "finishing") {
      this.form.RateStart = this.editFormData.RateStart;
      this.form.RateEnd = this.editFormData.RateEnd;
      this.form.TaskTcRate = this.editFormData.TaskTcRate;
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
          } else if (this.editType == "intermediary") {
            let editForm = {
              ID: this.editFormData.Id,
              ZkRate: this.form.money,
            };
            editIntermediary(editForm).then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
              }
            });
          } else if (this.editType == "intermediary") {
            let editForm = {
              ID: this.editFormData.Id,
              MonthTask: this.form.money,
            };
            editMonthlyTask(editForm).then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
              }
            });
          } else {
            let editForm = {
              ID: this.editFormData.Id,
              RateStart: this.form.RateStart,
              RateEnd: this.form.RateEnd,
              TaskTcRate: this.form.TaskTcRate,
            };
            editFinishing(editForm).then((res) => {
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
