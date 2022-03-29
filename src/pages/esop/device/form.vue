<!--
 * @Author: max
 * @Date: 2022-03-28 11:25:07
 * @LastEditTime: 2022-03-29 08:51:40
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/device/form.vue
-->
<template>
  <div>
    <a-modal :title="isEdit ? '编辑设备' : '添加设备'" :visible="visible" v-if="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="840">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="设备编码" prop="equipmentcode" :labelCol="{ span: 6 }">
              <a-input :disabled="isEdit" v-model="form.equipmentcode" allowClear placeholder="请输入设备编码" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="设备名称" prop="equipmentname" :labelCol="{ span: 6 }">
              <a-input v-model="form.equipmentname" allowClear placeholder="请输入设备名称" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="plantid" has-feedback label="生产工厂" prop="plantid" :labelCol="{ span: 6 }">
              <a-select v-model="form.plantid" placeholder="请选择生产工厂" @change="plantChange">
                <a-select-option v-for="(item, index) in plantList" :key="index" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="workcenterid" has-feedback label="生产产线" prop="workcenterid" :labelCol="{ span: 6 }">
              <a-select v-model="form.workcenterid" placeholder="请选择生产产线" @change="workShopChange">
                <a-select-option v-for="(item, index) in workshopList" :key="index" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="lineid" has-feedback label="生产车间" prop="lineid" :labelCol="{ span: 6 }">
              <a-select v-model="form.lineid" placeholder="请选择生产车间">
                <a-select-option v-for="(item, index) in lineList" :key="index" :value="item.LineId">{{ item.LineName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ip地址" :labelCol="{ span: 6 }">
              <a-input v-model="form.ipaddress" allowClear placeholder="请输入机构简称(中文)" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="mac地址" :labelCol="{ span: 6 }"><a-input v-model="form.macaddress" placeholder="请输入机构英文名"/></a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="序号" :labelCol="{ span: 6 }">
              <a-input v-model="form.sort" allowClear placeholder="请输入机构简称(英文)" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="Enable" label="是否启用" :labelCol="{ span: 6 }">
              <a-radio-group :value="form.enable" button-style="solid" @change="enableChange">
                <a-radio-button value="false">否</a-radio-button>
                <a-radio-button value="true">是</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="设备描述" :labelCol="{ span: 6 }">
              <a-textarea v-model="form.description" placeholder="请输入机构描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getProductionPersonnel, getWorkshopList, getLineList } from "@/services/web.js";
import { setSopDevice } from "@/services/esop.js";
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      plantid: "", //工厂
      plantList: [],
      workshopList: [],
      workshopId: "", //车间
      lineList: [],
      form: {
        equipmentcode: "",
        equipmentname: "",
        plantid: "",
        workcenterid: "",
        lineid: "",
        ipaddress: "",
        macaddress: "",
        description: "",
        enable: "true",
        sort: 1,
      },
      rules: {
        equipmentcode: [
          {
            required: true,
            message: "请输入设备编码",
            trigger: "blur",
          },
        ],
        equipmentname: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
        ],
        plantid: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        workcenterid: [
          {
            required: true,
            message: "请选择生产车间",
            trigger: "blur",
          },
        ],
        lineid: [
          {
            required: true,
            message: "请选择生产产线",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getEnterList();
    if (this.editData) {
      this.form = {
        equipmentcode: this.editData.EquipmentCode,
        equipmentname: this.editData.EquipmentName,
        plantid: this.editData.PlantId,
        workcenterid: this.editData.WorkCenterId,
        lineid: this.editData.LineId,
        ipaddress: this.editData.IPAddress,
        macaddress: this.editData.MACAddress,
        description: this.editData.Description,
        enable: this.editData.Enable.toString(),
        sort: this.editData.Sort,
      };
      this.plantid = this.editData.PlantId;
      this.getWorkshopList();
      this.workshopId = this.editData.WorkCenterId;
      this.getLineList();
    }
  },
  methods: {
    enableChange(value) {
      this.form.enable = value.target.value;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.equipmentid  = this.editData.EquipmentId
            setSopDevice(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
              }
            });
          } else {
            setSopDevice(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
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
    //工厂选择
    plantChange(e) {
      this.plantid = e;
      this.getWorkshopList();
      this.form.workcenterid = "";
      this.form.lineid = "";
    },
    //车间选择
    workShopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.form.lineid = "";
    },
    //获取生产工厂
    getEnterList() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getProductionPersonnel(parmas, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let parmas = {
        plantid: this.plantid,
      };
      getWorkshopList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantid,
        workshopid: this.workshopId,
      };
      getLineList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
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
