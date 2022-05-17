<!--
 * @Author: max
 * @Date: 2022-05-05 11:32:20
 * @LastEditTime: 2022-05-17 16:31:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/components/plcParamsForm.vue
-->
<template>
  <div>
    <a-modal :title="isEdit ? '编辑PLC参数' : '添加PLC参数'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="60%">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="ParamsTypeCode" has-feedback label="参数类型" prop="ParamsTypeCode">
              <a-select v-model="form.ParamsTypeCode" :disabled="isEdit" placeholder="请选择plc类型">
                <a-select-option v-for="item in paramsItem.PLC_PARAMS_TYPE" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarCode" has-feedback label="参数编码" prop="VarCode">
              <a-input v-model="form.VarCode" allowClear placeholder="请输入参数编码" :disabled="isEdit" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarName" has-feedback label="参数名称" prop="VarName">
              <a-input v-model="form.VarName" allowClear placeholder="请输入参数名称" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarDataType" has-feedback label="参数数据类型" prop="VarDataType">
              <a-select v-model="form.VarDataType" :disabled="isEdit" placeholder="请选择参数数据类型">
                <a-select-option v-for="item in paramsItem.PLC_PARAMS_DATA_TYPE" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarAddress" has-feedback label="参数地址" prop="VarAddress">
              <a-input v-model="form.VarAddress" allowClear placeholder="请输入参数地址" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarAddressBit" has-feedback label="参数地址位" prop="VarAddressBit">
              <a-select v-model="form.VarAddressBit" :disabled="isEdit" placeholder="请选择参数地址位">
                <a-select-option v-for="item in paramsItem.PLC_PARAMS_ADDRESS_BIT" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarDataTypeLen" has-feedback label="参数类型长度" prop="VarDataTypeLen">
              <a-input v-model="form.VarDataTypeLen" allowClear placeholder="请输入参数类型长度" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarDataTypeAccuracy" has-feedback label="参数类型精读" prop="VarDataTypeAccuracy">
              <a-input v-model="form.VarDataTypeAccuracy" allowClear placeholder="请输入参数类型精读" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarMinValue" has-feedback label="参数最小值" prop="VarMinValue">
              <a-input v-model="form.VarMinValue" allowClear placeholder="请输入参数最小值" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarMaxValue" has-feedback label="参数最大值" prop="VarMaxValue">
              <a-input v-model="form.VarMaxValue" allowClear placeholder="请输入参数最大值" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarStandardValue" has-feedback label="参数标准值" prop="VarStandardValue">
              <a-input v-model="form.VarStandardValue" allowClear placeholder="请输入参数标准值" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarIsMust" has-feedback label="是否必填" prop="VarIsMust">
              <a-select v-model="form.VarIsMust" :disabled="isEdit" placeholder="请选择是否必填">
                <a-select-option v-for="item in paramsItem.PLC_IS_MUST" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarPlcAuth" has-feedback label="PLC权限" prop="VarPlcAuth">
              <a-select v-model="form.VarPlcAuth" :disabled="isEdit" placeholder="请选择PLC权限">
                <a-select-option v-for="item in paramsItem.PLC_AUTH_RW" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="UpperComputerAuth" has-feedback label="上位机权限" prop="UpperComputerAuth">
              <a-select v-model="form.UpperComputerAuth" :disabled="isEdit" placeholder="请选择上位机权限">
                <a-select-option v-for="item in paramsItem.PLC_UUPER_COMPUTER_AUTH" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarDesc" label="参数描述">
              <a-textarea v-model="form.VarDesc" placeholder="请输入参数描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="Enable" label="是否启用">
              <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
                <a-radio-button value="N">否</a-radio-button>
                <a-radio-button value="Y">是</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <deviceList v-if="isShowDeviceList" @closeModal="closeModal" @selectDevice="selectDevice" />
    </a-modal>
  </div>
</template>

<script>
import { setPlcParamsAction } from "@/services/eap.js";
import deviceList from "./deviceList.vue";
export default {
  props: ["editData", "isEdit", "paramsItem"],
  components: { deviceList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      isShowDeviceList: false,
      form: {
        ParamsTypeCode: "",
        VarCode: "",
        VarName: "",
        VarAddress: "",
        VarAddressBit: "",
        VarDataType: "",
        VarDataTypeLen: "",
        VarDataTypeAccuracy: "",
        VarStandardValue: "",
        VarMaxValue: "",
        VarMinValue: "",
        VarIsMust: "",
        VarPlcAuth: "",
        UpperComputerAuth: "",
        Enable: "Y",
      },
      rules: {
        ParamsTypeCode: [
          {
            required: true,
            message: "请选择参数类型",
            trigger: "blur",
          },
        ],
        VarCode: [
          {
            required: true,
            message: "请输入参数编码",
            trigger: "blur",
          },
        ],
        VarName: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
        VarDataType: [
          {
            required: true,
            message: "请选择数据类型",
            trigger: "blur",
          },
        ],
        VarAddressBit: [
          {
            required: true,
            message: "请选择数据地址位",
            trigger: "blur",
          },
        ],
        VarIsMust: [
          {
            required: true,
            message: "请选择是否必须",
            trigger: "blur",
          },
        ],
        VarPlcAuth: [
          {
            required: true,
            message: "请选择PLC权限",
            trigger: "blur",
          },
        ],
        UpperComputerAuth: [
          {
            required: true,
            message: "请选择上位机权限",
            trigger: "blur",
          },
        ],
        VarAddress: [
          {
            required: true,
            message: "请输入参数地址",
            trigger: "blur",
          },
        ],
        VarDataTypeLen: [
          {
            required: true,
            message: "请输入参数数据长度",
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
              VarId: this.form.VarId,
              Enable: this.form.Enable,
              ParamsTypeCode: this.form.ParamsTypeCode,
              UpperComputerAuth: this.form.UpperComputerAuth,
              VarAddress: this.form.VarAddress,
              VarAddressBit: this.form.VarAddressBit,
              VarCode: this.form.VarCode,
              VarDataType: this.form.VarDataType,
              VarDataTypeAccuracy: this.form.VarDataTypeAccuracy,
              VarDataTypeLen: this.form.VarDataTypeLen,
              VarIsMust: this.form.VarIsMust,
              VarMaxValue: this.form.VarMaxValue,
              VarMinValue: this.form.VarMinValue,
              VarName: this.form.VarName,
              VarPlcAuth: this.form.VarPlcAuth,
              VarStandardValue: this.form.VarStandardValue,
            };
            setPlcParamsAction(editForm, "update").then((res) => {
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
            setPlcParamsAction(this.form, "add").then((res) => {
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
