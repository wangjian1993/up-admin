<!--
 * @Author: max
 * @Date: 2021-11-13 10:30:21
 * @LastEditTime: 2021-11-13 14:43:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/edit.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="编辑" @cancel="close" @ok="handleOk" centered width="45%">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="生产工厂" prop="PlantId">
                <a-select v-model="form.PlantId" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="计划生产日期" prop="PlanDate"><a-date-picker v-model="form.PlanDate"/></a-form-model-item
            ></a-col>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="生产车间" prop="WorkShopId">
                <a-select v-model="form.WorkShopId" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                  <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="订单交期" prop="OrderDate"><a-date-picker v-model="form.OrderDate"/></a-form-model-item
            ></a-col>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="生产产线" prop="LineId">
                <a-select v-model="form.LineId" style="width: 200px" placeholder="请选择生产产线">
                  <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                </a-select></a-form-model-item
              ></a-col
            >
            <a-col :span="12"
              ><a-form-model-item has-feedback label="下单日期" prop="OrderDeliveryDate"><a-date-picker v-model="form.OrderDeliveryDate"/></a-form-model-item
            ></a-col>
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
              ><a-form-model-item has-feedback label="计划数量" prop="PlanQty"> <a-input-number v-model="form.PlanQty" allowClear style="width: 200px" :min="0" placeholder="请输入计划数量"/></a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="品名"
                ><span>{{ editData.MitemName }}</span></a-form-model-item
              ></a-col
            >
          </a-row>
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="人均标准产能" prop="PerCapitaCapacity"> <a-input-number v-model="form.PerCapitaCapacity" allowClear style="width: 300px" :min="0" placeholder="请输入人均标准产能"/></a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="工时" prop="WorkHour"> <a-input-number v-model="form.WorkHour" allowClear style="width: 300px" :min="0" placeholder="请输入工时"/></a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="物料库存情况"><a-textarea v-model="form.MaterialShortage" placeholder="请输入物料库存情况" allow-clear/></a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="12"
              ><a-form-model-item has-feedback label="备注"><a-textarea v-model="form.Remarks" placeholder="请输入备注" allow-clear/></a-form-model-item
            ></a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getDailyPlanAction, getWorkshopList, getLineList,setDailyPlanAction} from "@/services/web.js";
export default {
  props: ["editData"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        Id: "",
        PlantId: "",
        WorkShopId: "",
        LineId: "",
        PlanDate: "",
        OrderDeliveryDate: "",
        OrderDate: "",
        WorkHour: 0,
        PlanQty: 0,
        PerCapitaCapacity: 0,
        MaterialShortage: "",
        Remarks: "",
      },
      rules: {
        PlantId: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        WorkShopId: [
          {
            required: true,
            message: "请选择生产车间",
            trigger: "blur",
          },
        ],
        LineId: [
          {
            required: true,
            message: "请选择生产产线",
            trigger: "blur",
          },
        ],
        PlanDate: [
          {
            required: true,
            message: "请选择计划生产日期",
            trigger: "blur",
          },
        ],
        OrderDeliveryDate: [
          {
            required: true,
            message: "请选择下单日期",
            trigger: "blur",
          },
        ],
        OrderDate: [
          {
            required: true,
            message: "请选择订单日期",
            trigger: "blur",
          },
        ],
        PlanQty: [
          {
            required: true,
            message: "请输入计划数量",
            trigger: "blur",
          },
        ],
        WorkHour: [
          {
            required: true,
            message: "请输入工时",
            trigger: "blur",
          },
        ],
        PerCapitaCapacity: [
          {
            required: true,
            message: "请输入人居标准产能",
            trigger: "blur",
          },
        ],
      },
      plantList: [],
      plantId: "",
      workshopList: [],
      lineList: [],
      workshopId: "",
    };
  },
  created() {
    this.getPlant();
    this.$nextTick(() => {
      this.form.PlantId = this.editData.PlantId;
      this.form.WorkShopId = this.editData.WorkShopId;
      this.form.LineId = this.editData.LineId;
      this.form.PlanDate = this.editData.PlanDate;
      this.form.OrderDeliveryDate = this.editData.OrderDeliveryDate;
      this.form.OrderDate = this.editData.OrderDate;
      this.form.PlanQty = this.editData.PlanQty;
      this.form.WorkHour = this.editData.WorkHour;
      this.form.PerCapitaCapacity = this.editData.PerCapitaCapacity;
      this.form.MaterialShortage = this.editData.MaterialShortage;
      this.form.Remarks = this.editData.Remarks;
      this.workshopId = this.editData.WorkShopId;
      this.plantId = this.editData.PlantId;
      //   this.getWorkshopList();
    });
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    plantChange(e) {
      if (e == "") return;
      this.form.WorkShopId = "";
      this.form.LineId = "";
      this.plantId = e;
      this.getWorkshopList();
    },
    //车间选择
    workshopChange(e) {
      if (e == "") return;
      this.form.LineId = "";
      this.workshopId = e;
      this.getLineList();
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDailyPlanAction(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.getWorkshopList();
        }
      });
    },
    //获取车间
    getWorkshopList() {
      let parmas = {
        plantid: this.plantId,
      };
      getWorkshopList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
          this.getLineList();
        }
      });
    },
    //获取产线
    getLineList() {
      let parmas = {
        plantid: this.plantId,
        workshopId: this.workshopId,
      };
      getLineList(parmas).then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.Id = this.editData.Id;
          if (typeof this.form.OrderDate === "object") {
            this.form.OrderDate = this.form.OrderDate.format("YYYY-MM-DD") + "T00:00:00";
          }
          if (typeof this.form.OrderDeliveryDate === "object") {
            this.form.OrderDeliveryDate = this.form.OrderDeliveryDate.format("YYYY-MM-DD") + "T00:00:00";
          }
          if (typeof this.form.PlanDate === "object") {
            this.form.PlanDate = this.form.PlanDate.format("YYYY-MM-DD") + "T00:00:00";
          }
          setDailyPlanAction(this.form, "update").then((res) => {
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
