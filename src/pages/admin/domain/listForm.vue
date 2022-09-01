<template>
  <div>
    <a-modal :title="isEdit ? '编辑采购域' : '添加采购域'" v-if="visible" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="areacode" has-feedback label="采购域编码" prop="areacode">
          <a-input v-model="form.areacode" allowClear placeholder="请输入采购域编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="areaname" has-feedback label="采购域名称" prop="areaname">
          <a-input v-model="form.areaname" allowClear placeholder="请输入采购域名称" />
        </a-form-model-item>
        <a-form-model-item ref="companyids" has-feedback label="机构" prop="companyids">
          <a-select mode="multiple" :default-value="ids" style="width: 100%" placeholder="请选择机构" @change="handleChange">
            <a-select-option v-for="item in plantList" :key="item.Id" :value="item.Id">
              {{ item.Name }}
            </a-select-option>
          </a-select>
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
import { setDomain } from "@/services/admin.js";
export default {
  props: ["editData", "isEdit", "plantList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        areacode: "",
        areaname: "",
        companyids: [],
        Enable: "Y",
      },
      ids:[],
      rules: {
        areacode: [
          {
            required: true,
            message: "请输入采购域编码",
            trigger: "blur",
          },
        ],
        areaname: [
          {
            required: true,
            message: "请输入采购域名称",
            trigger: "blur",
          },
        ],
        companyids: [
          {
            required: true,
            message: "请选择机构",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.form.areacode = this.editData.AreaCode;
      this.form.areaname = this.editData.AreaName;
      this.ids =  this.editData.CompanyIds.split(",")
      this.form.companyids = this.ids;
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
    handleChange(value) {
      this.form.companyids = value
    },
    handleOk() {
      console.log(this.form);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              id: this.editData.Id,
              areacode: this.form.areacode,
              areaname: this.form.areaname,
              companyids: this.form.companyids,
              Enable: this.form.Enable,
            };
            setDomain(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setDomain(this.form, "add").then((res) => {
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
