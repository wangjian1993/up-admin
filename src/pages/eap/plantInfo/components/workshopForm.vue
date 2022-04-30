<template>
  <div>
    <a-modal :title="isEdit ? '编辑产线配置' : '添加产线配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
          <a-select v-model="form.PlantId" :disabled="isEdit" placeholder="请选择生产工厂">
            <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="WorkShopCode" has-feedback label="车间编码" prop="WorkShopCode">
          <a-input v-model="form.WorkShopCode" allowClear placeholder="请输入车间编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="WorkShopName" has-feedback label="车间名称" prop="WorkShopName">
          <a-input v-model="form.WorkShopName" allowClear placeholder="请输入车间名称" />
        </a-form-model-item>
        <a-form-model-item ref="WorkShopDesc" label="车间描述">
          <a-textarea v-model="form.WorkShopDesc" placeholder="请输入车间描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
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
import { getPlantList, setWorkshopAction } from "@/services/eap.js";
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
        WorkShopCode: "",
        WorkShopName: "",
        WorkShopDesc: "",
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
        WorkShopCode: [
          {
            required: true,
            message: "请输入车间编码",
            trigger: "blur",
          },
        ],
        WorkShopName: [
          {
            required: true,
            message: "请输入车间名称",
            trigger: "blur",
          },
        ],
      },
      plantList: [],
      plantId: "",
    };
  },
  created() {
    this.getPlant();
    if (this.isEdit) {
      this.form.PlantId = this.editData.PlantId;
      this.form.WorkShopCode = this.editData.WorkShopCode;
      this.form.WorkShopName = this.editData.WorkShopName;
      this.form.WorkShopDesc = this.editData.WorkShopDesc;
      this.form.Enable = this.editData.Enable;
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
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getPlantList(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
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
              WorkShopId: this.editData.WorkShopId,
              WorkShopCode: this.form.WorkShopCode,
              WorkShopName: this.form.WorkShopName,
              WorkShopDesc: this.form.WorkShopDesc,
              Enable: this.form.Enable,
            };
            setWorkshopAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setWorkshopAction(this.form, "add").then((res) => {
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
