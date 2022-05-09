<!--
 * @Author: max
 * @Date: 2022-05-05 11:32:20
 * @LastEditTime: 2022-05-09 14:50:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/components/plcForm.vue
-->
<template>
  <div>
    <a-modal :title="isEdit ? '编辑PLC配置' : '添加PLC配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EquimentName" has-feedback label="对接设备" prop="EquimentName">
          <a-input v-model="form.EquimentName" allowClear placeholder="请选择对接设备" disabled>
            <a-icon slot="addonAfter" type="plus" @click="showDevice" :disabled="isEdit" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item ref="PlcTypeCode" has-feedback label="PCL类型" prop="PlcTypeCode">
          <a-select v-model="form.PlcTypeCode" :disabled="isEdit" placeholder="请选择plc类型">
            <a-select-option v-for="item in plcTypeList" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="PlcBrand" has-feedback label="PLC品牌" prop="PlcBrand">
          <a-select v-model="form.PlcBrand" :disabled="isEdit" placeholder="请选择PLC品牌">
            <a-select-option v-for="item in plcBrand" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="PlcName" has-feedback label="PLC名称" prop="PlcName">
          <a-input v-model="form.PlcName" allowClear placeholder="请输入PLC名称" />
        </a-form-model-item>
        <a-form-model-item ref="PlcCode" has-feedback label="PLC编码" prop="PlcCode">
          <a-input v-model="form.PlcCode" allowClear placeholder="请输入PLC编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="PlcIp" has-feedback label="IP地址" prop="PlcIp">
          <a-input v-model="form.PlcIp" allowClear placeholder="请输入IP地址" />
        </a-form-model-item>
        <a-form-model-item ref="PlcPort" has-feedback label="端口" prop="PlcPort">
          <a-input v-model="form.PlcPort" allowClear placeholder="请输入端口" />
        </a-form-model-item>
        <a-form-model-item ref="PlcMac" has-feedback label="Mac地址" prop="PlcMac">
          <a-input v-model="form.PlcMac" allowClear placeholder="请输入Mac地址" />
        </a-form-model-item>
        <a-form-model-item ref="PlcDesc" label="PLC描述">
          <a-textarea v-model="form.PlcDesc" placeholder="请输入PLC描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item ref="Enable" label="是否启用">
          <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
            <a-radio-button value="N">否</a-radio-button>
            <a-radio-button value="Y">是</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <deviceList v-if="isShowDeviceList" @closeModal="closeModal" @selectDevice="selectDevice" />
    </a-modal>
  </div>
</template>

<script>
import { setPlcAction } from "@/services/eap.js";
import deviceList from "./deviceList.vue";
export default {
  props: ["editData", "isEdit", "plcBrand", "plcTypeList"],
  components: { deviceList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      isShowDeviceList: false,
      form: {
        EquimentName: "",
        PlcTypeCode: "",
        PlcBrand: "",
        PlcCode: "",
        PlcName: "",
        PlcDesc: "",
        PlcIp: "",
        PlcPort: 80,
        PlcMac: "",
        Enable: "Y",
      },
      rules: {
        EquimentName: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        PlcTypeCode: [
          {
            required: true,
            message: "请选择PLC类型",
            trigger: "blur",
          },
        ],
        PlcBrand: [
          {
            required: true,
            message: "请输入PLC品牌",
            trigger: "blur",
          },
        ],
        PlcCode: [
          {
            required: true,
            message: "请输入PLC编码",
            trigger: "blur",
          },
        ],
        PlcName: [
          {
            required: true,
            message: "请输入PLC名称",
            trigger: "blur",
          },
        ],
        PlcIp: [
          {
            required: true,
            message: "请输入ip地址",
            trigger: "blur",
          },
        ],
        PlcPort: [
          {
            required: true,
            message: "请输入吨口",
            trigger: "blur",
          },
        ],
        PlcMac: [
          {
            required: true,
            message: "请输入mac地址",
            trigger: "blur",
          },
        ],
      },
      deviceInfo: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
    }
  },
  methods: {
    showDevice() {
      this.isShowDeviceList = true;
    },
    closeModal() {
      this.isShowDeviceList = false;
    },
    close() {
      this.$emit("closeModal");
    },
    selectDevice(info) {
      this.isShowDeviceList = false;
      this.deviceInfo = info;
      this.form.EquimentName = info.EquimentName;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              PlcId: this.form.PlcId,
              EquimentId: this.form.EquimentId,
              PlcTypeCode: this.form.PlcTypeCode,
              PlcBrand: this.form.PlcBrand,
              PlcName: this.form.PlcName,
              PlcDesc: this.form.PlcDesc,
              PlcIp: this.form.PlcIp,
              PlcPort: this.form.PlcPort,
              PlcMac: this.form.PlcMac,
            };
            setPlcAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            this.form.EquimentId = this.deviceInfo.EquimentId;
            delete this.form.EquimentName;
            setPlcAction(this.form, "add").then((res) => {
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
