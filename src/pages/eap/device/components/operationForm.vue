<!--
 * @Author: max
 * @Date: 2022-05-05 11:32:20
 * @LastEditTime: 2022-06-07 09:07:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/components/operationForm.vue
-->
<template>
  <div>
    <a-modal :title="isEdit ? '编辑PLC运行参数' : '添加PLC运行参数'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="60%">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="PlcName" has-feedback label="选择PLC" prop="PlcName">
              <a-input v-model="form.PlcName" allowClear placeholder="请选择PLC" disabled>
                <a-icon slot="addonAfter" type="plus" @click="showPLC" :disabled="isEdit" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarId" has-feedback label="选择参数" prop="VarId">
              <a-select v-model="form.VarId" :disabled="isEdit" placeholder="选择参数" @change="paramsChange">
                <a-select-option v-for="item in paramsList" :key="item.VarId" :value="item.VarId">{{ item.VarName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="ParamsTypeCode" has-feedback label="参数类型" prop="ParamsTypeCode">
              <a-select v-model="form.ParamsTypeCode" :disabled="isEdit" placeholder="请选择参数类型" @change="paramsType">
                <a-select-option v-for="item in paramsItem.PLC_PARAMS_TYPE" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="VarDataType" has-feedback label="参数数据类型" prop="VarDataType">
              <a-select v-model="form.VarDataType" placeholder="请选择参数数据类型">
                <a-select-option v-for="item in paramsItem.PLC_PARAMS_DATA_TYPE" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
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
              <a-select v-model="form.VarAddressBit" placeholder="请选择参数地址位">
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
              <a-select v-model="form.VarIsMust" placeholder="请选择是否必填">
                <a-select-option v-for="item in paramsItem.PLC_IS_MUST" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="VarPlcAuth" has-feedback label="PLC权限" prop="VarPlcAuth">
              <a-select v-model="form.VarPlcAuth" disabled placeholder="请选择PLC权限">
                <a-select-option v-for="item in paramsItem.PLC_AUTH_RW" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="UpperComputerAuth" has-feedback label="上位机权限" prop="UpperComputerAuth">
              <a-select v-model="form.UpperComputerAuth" disabled placeholder="请选择上位机权限">
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
            <a-form-model-item ref="VarUnit" has-feedback label="参数单位" prop="VarUnit">
              <a-select v-model="form.VarUnit" placeholder="请选择上位机权限">
                <a-select-option v-for="item in paramsItem.DATA_UNIT" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
              </a-select>
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
      <plcList v-if="isShowPlcList" @closeModal="closeModal" @selectPlc="selectPlc" />
    </a-modal>
  </div>
</template>

<script>
import { setOperationAction, getPlcParamsAction } from "@/services/eap.js";
import plcList from "./plcList.vue";
export default {
  props: ["editData", "isEdit", "paramsItem"],
  components: { plcList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      isShowPlcList: false,
      form: {
        PlcId: "",
        PlcName: "",
        ParamsTypeCode: "",
        VarId: "",
        VarAddress: "",
        VarAddressBit: "",
        VarDataType: "",
        VarDataTypeLen: 0,
        VarDataTypeAccuracy: 0,
        VarMaxValue: "",
        VarMinValue: "",
        VarStandardValue: "",
        VarValue: "",
        VarIsMust: "",
        VarPlcAuth: "",
        UpperComputerAuth: "",
        VarUnit:"",
        Enable: "Y",
      },
      rules: {
        PlcName: [
          {
            required: true,
            message: "请选择Plc",
            trigger: "blur",
          },
        ],
        VarId: [
          {
            required: true,
            message: "请选择参数",
            trigger: "blur",
          },
        ],
        ParamsTypeCode: [
          {
            required: true,
            message: "请选择参数类型",
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
      plcInfo: [],
      paramsList: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
      this.paramsType(this.form.ParamsTypeCode);
    }
  },
  methods: {
    showPLC() {
      if (this.isEdit) return;
      this.isShowPlcList = true;
    },
    closeModal() {
      this.isShowPlcList = false;
    },
    selectPlc(list) {
      this.isShowPlcList = false;
      this.plcInfo = list;
      this.form.PlcId = list.PlcId;
      this.form.PlcName = list.PlcName;
    },
    paramsChange(e) {
      let result = this.paramsList.find((item) => item.VarId == e);
      this.form.VarAddress = result.VarAddress;
      this.form.VarAddressBit = result.VarAddressBit;
      this.form.VarDataType = result.VarDataType;
      this.form.VarDataTypeLen = result.VarDataTypeLen;
      this.form.VarDataTypeAccuracy = result.VarDataTypeAccuracy;
      this.form.VarMaxValue = result.VarMaxValue;
      this.form.VarMinValue = result.VarMinValue;
      this.form.VarStandardValue = result.VarStandardValue;
      this.form.VarValue = result.VarValue;
      this.form.VarIsMust = result.VarIsMust;
      this.form.VarPlcAuth = result.VarPlcAuth;
      this.form.UpperComputerAuth = result.UpperComputerAuth;
      this.form.VarUnit = result.VarUnit
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
    paramsType(e) {
      if (!this.isEdit) {
        this.paramsList = [];
        this.form.VarId = "";
        this.form.VarAddress = "";
        this.form.VarAddressBit = "";
        this.form.VarDataType = "";
        this.form.VarDataTypeLen = 0;
        this.form.VarDataTypeAccuracy = 0;
        this.form.VarMaxValue = "";
        this.form.VarMinValue = "";
        this.form.VarStandardValue = "";
        this.form.VarValue = "";
        this.form.VarIsMust = "";
        this.form.VarPlcAuth = "";
        this.form.UpperComputerAuth = "";
        this.form.VarUnit =""
      }
      let parmas = {
        paramstype: e,
      };
      getPlcParamsAction(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.paramsList = res.data.data;
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let varData = this.paramsList.find((item) => item.VarId == this.form.VarId);
          this.form.VarValue = varData.VarName;
          if (this.isEdit) {
            let editForm = {
              VarValueId: this.form.VarValueId,
              VarAddress: this.form.VarAddress,
              VarAddressBit: this.form.VarAddressBit,
              VarDataType: this.form.VarDataType,
              VarDataTypeLen: this.form.VarDataTypeLen,
              VarDataTypeAccuracy: this.form.VarDataTypeAccuracy,
              VarMaxValue: this.form.VarMaxValue,
              VarMinValue: this.form.VarMinValue,
              VarStandardValue: this.form.VarStandardValue,
              VarValue: this.form.VarValue,
              VarIsMust: this.form.VarIsMust,
              VarPlcAuth: this.form.VarPlcAuth,
              UpperComputerAuth: this.form.UpperComputerAuth,
              VarUnit: this.form.VarUnit,
              Enable: this.form.Enable,
            };
            setOperationAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            delete this.form.PlcName;
            setOperationAction(this.form, "add").then((res) => {
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
