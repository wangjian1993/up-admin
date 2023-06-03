<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-05-16 16:18:57
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/product/assembly/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑首件检查' : '添加首件检查'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" :width="800">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="扫描条码/工单号" prop="QrCode"> <a-input :disabled="isEdit" allowClear ref="orderValue" v-model.trim="orderValue" placeholder="" @change="inputChange" @blur="inputBlur()" @pressEnter="scanCode" auto-size /> </a-form-model-item>
        <a-form-model-item ref="companyid" has-feedback label="生产工序" prop="ProcessId">
          <a-select v-model="form.ProcessId" :disabled="isEdit" placeholder="请选择生产工序">
            <a-select-option v-for="item in procedureData" :key="item.Id" :value="item.Id">{{ item.ProcessName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="工厂/车间/产线">
          <a-select style="width: 120px" :disabled="isEdit" placeholder="请选择生产工厂" v-model="form.PlantId" @change="plantChange">
            <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
          <span>-</span>
          <a-select style="width: 140px" :disabled="isEdit" placeholder="请选择生产车间" v-model="form.WorkShopId" @change="workshopChange">
            <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
          </a-select>
          <span>-</span>
          <a-select style="width: 140px" :disabled="isEdit" v-model="form.LineId" placeholder="请选择生产产线">
            <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item has-feedback label="订单号">
              <span>{{ itemInfo.OrderNo }}</span>
            </a-form-model-item></a-col
          >
          <a-col :span="12">
            <a-form-model-item has-feedback label="工单号">
              <span>{{ itemInfo.MoCode }}</span>
            </a-form-model-item></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="12"
            ><a-form-model-item has-feedback label="工单数量">
              <span>{{ itemInfo.MoQty }}</span>
            </a-form-model-item></a-col
          >
          <a-col :span="12">
            <a-form-model-item has-feedback label="订单数量">
              <span>{{ itemInfo.OrderQty }}</span>
            </a-form-model-item></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item has-feedback label="订单项目">
              <span>{{ itemInfo.OrderItem }}</span>
            </a-form-model-item></a-col
          >
          <a-col :span="12">
            <a-form-model-item has-feedback label="品号">
              <span>{{ itemInfo.ProCode }}</span>
            </a-form-model-item></a-col
          >
        </a-row>
        <a-form-model-item has-feedback label="品名">
          <span>{{ itemInfo.ProName }}</span>
        </a-form-model-item>
        <a-form-model-item has-feedback label="规格">
          <span>{{ itemInfo.ProSpec }}</span>
        </a-form-model-item>
        <a-form-model-item label="首件检测结果" prop="InspectResult">
          <a-select v-model="form.InspectResult" placeholder="请选择首件检测结果">
            <a-select-option v-for="item in paramsResult" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="不合格原因">
          <a-select v-model="form.NGReason" allowClear placeholder="请选择不合格原因">
            <a-select-option v-for="item in paramsItem" allowClear :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="不合格描述">
          <a-textarea v-model="form.NGRemarks" placeholder="请输入不合格描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setProductAssembly } from "@/services/qms.js";
import { getProcessLine, getDailyReport } from "@/services/web.js";
import { getParamData } from "@/services/admin.js";
export default {
  props: ["editData", "isEdit", "enterList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      orderValue: "",
      itemInfo: [],
      paramsItem: [],
      procedureData: [],
      workshopList: [],
      lineList: [],
      workshopId: "",
      plantList: [],
      plantid: "",
      form: {
        ProcessId: "",
        PlantId: "",
        WorkShopId: "",
        MoCode: "",
        QrCode: "",
        LineId: "",
        InspectResult: "",
        NGReason: "",
        NGRemarks: "",
      },
      rules: {
        ProcessId: [
          {
            required: true,
            message: "请选择生产工序",
            trigger: "blur",
          },
        ],
        InspectResult: [
          {
            required: true,
            message: "请选择检测结果",
            trigger: "blur",
          },
        ],
      },
      paramsResult: [],
    };
  },
  created() {
    this.getParamsData();
    this.getProcess();
    this.getPlant();
    if (this.isEdit) {
      console.log("this.editData ", this.editData);
      this.form = { ...this.editData };
      this.orderValue = this.editData.MoCode;
      this.itemInfo = { ...this.editData };
      this.plantId = this.itemInfo.PlantId;
      this.workshopId = this.itemInfo.WorkShopId;
      this.getWorkshopList();
      this.getLineList();
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    enableChange(value) {
      this.form.InspectResult = value.target.value;
    },
    getProcess() {
      let params = {
        pageindex: 1,
        pagesize: 100,
      };
      getProcessLine(params, "getall").then((res) => {
        if (res.data.success) {
          this.procedureData = res.data.data.list;
          console.log("this.procedureData", this.procedureData);
        }
      });
    },
    getParamsData() {
      let params = {
        groupcode: "FINISHED_PRODUCT_INSPECT_NG_REASON",
      };
      getParamData(params).then((res) => {
        if (res.data.success) {
          this.paramsItem = res.data.data;
        }
      });
      let params1 = {
        groupcode: "IQC_INCOMING_TEST_ITEM_RESULT",
      };
      getParamData(params1).then((res) => {
        if (res.data.success) {
          this.paramsResult = res.data.data;
        }
      });
    },
    inputBlur() {
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue.focus();
        }, 10000);
      }
    },
    closeModal() {
      this.isUser = false;
    },
    inputChange(e) {
      const { value } = e.target;
      if (!value && e.type !== "change") {
        // do something
        this.emptyData();
      }
    },
    plantChange(e) {
      if (e == "") return;
      this.plantId = e;
      this.form.WorkShopId = "";
      this.form.LineId = "";
      this.getWorkshopList();
    },
    //车间选择
    workshopChange(e) {
      if (e == "") return;
      this.workshopId = e;
      this.form.LineId = "";
      this.getLineList();
    },
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getDailyReport(params1, "getplantlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
        }
      });
    },
    //获取车间
    getWorkshopList() {
      let params = {
        plantid: this.plantId,
      };
      getDailyReport(params, "getworkshoplist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    //获取产线
    getLineList() {
      let params = {
        workshop: this.workshopId,
      };
      getDailyReport(params, "getlinelist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    //扫码
    scanCode(e) {
      // e.currentTarget.select();
      try {
        e.currentTarget.select();
        if (e.keyCode == 13) {
          event.preventDefault(); // 阻止浏览器默认换行操作
        }
      } catch (error) {
        console.log("error===");
      }
      if (!this.orderValue) {
        this.$message.w("请先输入工单号，或者扫描工单!");
      }
      let params = {
        QrCode: this.orderValue,
      };
      setProductAssembly(params, "scan").then((res) => {
        if (res.data.success) {
          console.log("res", res);
          this.itemInfo = res.data.data;
          this.form.ProcessId = this.itemInfo.ProcessId;
          if (this.itemInfo.PlantId !== "") {
            this.form.PlantId = this.itemInfo.PlantId;
            this.form.WorkShopId = this.itemInfo.WorkShopId;
            this.form.LineId = this.itemInfo.LineId;
            this.plantId = this.itemInfo.PlantId;
            this.workshopId = this.itemInfo.WorkShopId;
            this.getWorkshopList();
            this.getLineList();
          }
        }
      });
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              Id: this.editData.Id, //部门ID
              InspectResult: this.form.InspectResult, //公司ID
              NGReason: this.form.NGReason, //部门名称
              NGRemarks: this.form.NGRemarks,
            };
            setProductAssembly(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            this.form.MoCode = this.itemInfo.MoCode;
            this.form.QrCode = this.itemInfo.QrCode;
            setProductAssembly(this.form, "submit").then((res) => {
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
