<template>
  <div>
    <a-modal :title="isEdit ? '编辑产线配置' : '添加产线配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
          <a-select v-model="form.PlantId" :disabled="isEdit" placeholder="请选择生产工厂" @change="plantChange">
            <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="WorkShopId" has-feedback label="生产车间" prop="WorkShopId">
          <a-select v-model="form.WorkShopId" :disabled="isEdit" placeholder="请选择生产工厂" @change="workshopChange">
            <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="LineId" has-feedback label="生产产线" prop="LineId">
          <a-select v-model="form.LineId" :disabled="isEdit" placeholder="请选择生产产线">
            <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="WorkStationCode" has-feedback label="工站编码" prop="WorkStationCode">
          <a-input v-model="form.WorkStationCode" allowClear placeholder="请输入工站编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="WorkStationName" has-feedback label="工站名称" prop="WorkStationName">
          <a-input v-model="form.WorkStationName" allowClear placeholder="请输入工站名称" />
        </a-form-model-item>
        <a-form-model-item ref="SortNo" has-feedback label="工站序号" prop="SortNo">
          <a-input-number min="0" v-model="form.SortNo" allowClear placeholder="请输入工站名称" />
        </a-form-model-item>
        <a-form-model-item ref="WorkStationDesc" label="工站描述">
          <a-textarea v-model="form.WorkStationDesc" placeholder="请输入工站描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item ref="Enable" label="是否启用">
          <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
            <a-radio-button value="N">否</a-radio-button>
            <a-radio-button value="Y">是</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getPlantList, getWorkshopAction, setWorkstationAction } from "@/services/eap.js";
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        WorkShopId: "",
        LineId: "",
        WorkStationCode: "",
        WorkStationName: "",
        WorkStationDesc: "",
        SortNo:"",
        Enable: "Y",
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
        WorkStationCode: [
          {
            required: true,
            message: "请输入工站编码",
            trigger: "blur",
          },
        ],
        WorkStationName: [
          {
            required: true,
            message: "请输入工站名称",
            trigger: "blur",
          },
        ],
        SortNo:[
          {
            required: true,
            message: "请输入工站序号",
            trigger: "blur",
          },
        ]
      },
      plantList: [],
      workshopList: [],
      lineList: [],
      plantId: "",
    };
  },
  created() {
    this.getPlant();
    if (this.isEdit) {
      this.plantChange(this.editData.PlantId);
      this.plantId = this.editData.PlantId
      this.workshopChange(this.editData.WorkShopId);
      this.form = this.editData;
      console.log(this.editData);
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getPlantList(params1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    plantChange(e) {
      this.plantId = e;
      this.form.WorkShopId = "";
      let params = {
        plantid: e,
      };
      getWorkshopAction(params, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    workshopChange(e) {
      let params = {
        plantid: this.plantId,
        workshopid: e,
      };
      getPlantList(params, "getlist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
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
              PlantId: this.form.PlantId,
              LineId: this.form.LineId,
              WorkShopId: this.form.WorkShopId,
              LineName: this.form.LineName,
              LineCode: this.form.LineCode,
              LineDesc: this.form.LineDesc,
              Enable: this.form.Enable,
            };
            setWorkstationAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setWorkstationAction(this.form, "add").then((res) => {
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
