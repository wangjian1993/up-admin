<!--
 * @Author: max
 * @Date: 2022-05-05 11:32:20
 * @LastEditTime: 2022-05-05 14:34:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/components/listForm.vue
-->
<template>
  <div>
    <a-modal :title="isEdit ? '编辑设备配置' : '添加设备配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EquimentTypeId" has-feedback label="设备类型" prop="EquimentTypeId">
          <a-select v-model="form.EquimentTypeId" :disabled="isEdit" placeholder="请选择设备类型">
            <a-select-option v-for="item in deviceTypeList" :key="item.ID" :value="item.ID">{{ item.EQUIPMENT_TYPE_NAME }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="Brand" has-feedback label="设备品牌" prop="Brand">
          <a-select v-model="form.Brand" :disabled="isEdit" placeholder="请选择设备品牌">
            <a-select-option v-for="item in deviceBrand" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="EquimentCode" has-feedback label="设备编码" prop="EquimentCode">
          <a-input v-model="form.EquimentCode" allowClear placeholder="请输入设备编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="EquimentName" has-feedback label="设备名称" prop="EquimentName">
          <a-input v-model="form.EquimentName" allowClear placeholder="请输入设备名称" />
        </a-form-model-item>
        <!-- <a-form-model-item ref="LineName" has-feedback label="设备状态" prop="LineName">
          <a-input v-model="form.LineName" allowClear placeholder="请输入设备名称" />
        </a-form-model-item> -->
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
import { setDeviceAction } from "@/services/eap.js";
export default {
  props: ["editData", "isEdit", "deviceBrand", "deviceTypeList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EquimentTypeId: "",
        EquimentCode: "",
        EquimentName: "",
        EquimentDesc: "",
        Brand: "",
        Enable: "Y",
      },
      rules: {
        EquimentTypeId: [
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
      },
      plantList: [],
      workshopList: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
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
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              EquimentId: this.form.EquimentId,
              EquimentTypeId: this.form.EquimentTypeId,
              Brand: this.form.Brand,
              EquimentName: this.form.EquimentName,
              EquimentDesc: this.form.EquimentDesc,
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
