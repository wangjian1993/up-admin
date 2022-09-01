<template>
  <div>
    <a-modal :title="isEdit ? '编辑通知' : '添加通知'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="title" has-feedback label="标题" prop="title">
          <a-input v-model="form.title" allowClear placeholder="请输入标题" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="LineName" has-feedback label="发件企业" prop="LineName">
          <a-input v-model="form.LineName" allowClear placeholder="请输入发件企业" />
        </a-form-model-item>
        <a-form-model-item label="优先级">
          <a-radio-group v-model="form.priority" prop="priority">
            <a-radio value="1">
              重要
            </a-radio>
            <a-radio value="2">
              一般
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="content" label="通知内容">
          <a-textarea v-model="form.content" placeholder="请输入通知内容" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getPlantList, getWorkshopAction, setLineAction } from "@/services/eap.js";
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
        LineCode: "",
        LineName: "",
        LineDesc: "",
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
        LineCode: [
          {
            required: true,
            message: "请输入产线编码",
            trigger: "blur",
          },
        ],
        LineName: [
          {
            required: true,
            message: "请输入产线名称",
            trigger: "blur",
          },
        ],
      },
      plantList: [],
      workshopList: [],
    };
  },
  created() {
    this.getPlant();
    if (this.isEdit) {
      this.plantChange(this.editData.PlantId);
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
            setLineAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setLineAction(this.form, "add").then((res) => {
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
