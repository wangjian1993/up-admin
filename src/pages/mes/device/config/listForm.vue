<!--
 * @Author: max
 * @Date: 2022-05-05 11:32:20
 * @LastEditTime: 2022-05-31 10:06:21
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/device/config/listForm.vue
-->
<template>
  <div>
    <a-modal :title="isEdit ? '编辑设备配置' : '添加设备配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
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
        <a-form-model-item ref="EquimentTypeCode" has-feedback label="设备类型" prop="EquimentTypeCode">
          <a-select v-model="form.EquimentTypeCode" :disabled="isEdit" placeholder="请选择设备类型">
            <a-select-option v-for="item in deviceTypeList" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="Brand" has-feedback label="设备品牌" prop="Brand">
          <a-select v-model="form.Brand" :disabled="isEdit" placeholder="请选择设备品牌">
            <a-select-option v-for="item in deviceBrand" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="EquimentCode" has-feedback label="设备编码" prop="EquimentCode">
          <a-input v-model="form.EquimentCode" allowClear placeholder="请输入设备编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="EquimentName" has-feedback label="设备名称" prop="EquimentName">
          <a-input v-model="form.EquimentName" allowClear placeholder="请输入设备名称" />
        </a-form-model-item>
        <a-form-model-item ref="IPAddress" has-feedback label="IP地址">
          <a-input v-model="form.IPAddress" allowClear placeholder="请输入IP地址" />
        </a-form-model-item>
        <a-form-model-item ref="IPPort" has-feedback label="端口号">
          <a-input v-model="form.IPPort" allowClear placeholder="请输入端口号" />
        </a-form-model-item>
        <a-form-model-item ref="MacAddress" has-feedback label="MAC地址" prop="MacAddress">
          <a-input v-model="form.MacAddress" allowClear placeholder="请输入MAC地址" />
        </a-form-model-item>
        <a-form-model-item ref="EquimentDesc" label="设备描述">
          <a-textarea v-model="form.EquimentDesc" placeholder="请输入设备描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
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
import { setDeviceAction } from "@/services/admin.js";
import { getWorkshopList, getLineList, getDailyPlanAction } from "@/services/web.js";
export default {
  props: ["editData", "isEdit", "deviceBrand", "deviceTypeList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        LineId: "",
        WorkshopId: "",
        EquimentTypeCode: "",
        EquimentCode: "",
        EquimentName: "",
        EquimentDesc: "",
        Brand: "",
        IPAddress: "",
        IPPort: "",
        MacAddress: "",
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
        LineId: [
          {
            required: true,
            message: "请选择生产车间",
            trigger: "blur",
          },
        ],
        WorkshopId: [
          {
            required: true,
            message: "请选择生产产线",
            trigger: "blur",
          },
        ],
        EquimentTypeCode: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: "blur",
          },
        ],
        Brand: [
          {
            required: true,
            message: "请选择设备品牌",
            trigger: "blur",
          },
        ],
        EquimentCode: [
          {
            required: true,
            message: "请输入设备编码",
            trigger: "blur",
          },
        ],
        EquimentName: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
        ],
        MacAddress: [
          {
            required: true,
            message: "请输入MAC地址",
            trigger: "blur",
          },
        ],
      },
      plantList: [],
      workshopList: [],
      lineList: [],
    };
  },
  created() {
    this.getPlant();
    if (this.isEdit) {
      this.form = this.editData;
      this.plantChange(this.form.PlantId);
      this.workshopChange(this.form.WorkShopId);
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    getPlant() {
      let params = {
        entertypecode: "PLANT",
      };
      getDailyPlanAction(params, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    //获取车间
    plantChange(e) {
      let params = {
        plantid: e,
      };
      getWorkshopList(params, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    //获取产线
    workshopChange(e) {
      let params = {
        plantid: this.form.PlantId,
        workshopId: e,
      };
      getLineList(params).then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              EquimentId: this.form.EquimentId,
              PlantId:  this.form.PlantId,
              LineId: this.form.LineId,
              EquimentTypeCode: this.form.EquimentTypeCode,
              Brand:this.form.Brand,
              EquimentName:this.form.EquimentName,
              EquimentDesc: this.form.EquimentDesc,
              IPAddress:this.form.IPAddress,
              IPPort: this.form.IPPort,
              MacAddress: this.form.MacAddress,
            };
            setDeviceAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setDeviceAction(this.form, "add").then((res) => {
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
