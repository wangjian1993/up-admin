<!--
 * @Author: max
 * @Date: 2021-11-29 15:04:20
 * @LastEditTime: 2022-10-19 16:45:12
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/components/processForm.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="isEdit ? '编辑工序' : '添加工序'" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select style="width: 200px" placeholder="请选择生产工厂" v-model="form.PlantId">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item has-feedback label="工序类型">
            <a-select style="width: 200px" placeholder="请选择工序类型" v-model="form.ProcessTypeCode">
              <a-select-option v-for="item in processType" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="ProcessName" has-feedback label="工序名称" prop="ProcessName">
            <a-input v-model="form.ProcessName" allowClear placeholder="请输入工序名称" />
          </a-form-model-item>
          <a-form-model-item ref="ProcessCode" has-feedback label="工序编码" prop="ProcessCode">
            <a-input v-model.trim="form.ProcessCode" allowClear placeholder="请输入工序编码" :disabled="isEdit" />
          </a-form-model-item>
          <a-form-model-item ref="Step" has-feedback label="工序步骤" prop="Step">
            <a-input-number v-model="form.Step" style="width:200px" allowClear placeholder="请输入工序步骤" :min="1" />
          </a-form-model-item>
          <a-form-model-item ref="ProcessDesc" label="工序描述">
            <a-textarea v-model="form.ProcessDesc" placeholder="请输入工序描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="IsAgeing" label="是否老化">
            <a-radio-group :value="form.IsAgeing" button-style="solid" @change="isAgeingChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { setProcess } from "@/services/mes.js";
import { getParamData } from "@/services/admin.js";
export default {
  props: ["plantList", "editData", "isEdit"],
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        ProcessCode: "",
        ProcessName: "",
        ProcessDesc: "",
        Step: "",
        Enable: "Y",
        ProcessTypeCode: "POWER_SUPPLY",
        IsAgeing:"N"
      },
      rules: {
        PlantId: [
          {
            required: true,
            message: "请输入生产工厂",
            trigger: "blur",
          },
        ],
        ProcessCode: [
          {
            required: true,
            message: "请输入工序编码",
            trigger: "blur",
          },
        ],
        ProcessName: [
          {
            required: true,
            message: "请输入工序名称",
            trigger: "blur",
          },
        ],
        Step: [
          {
            required: true,
            message: "请选择工序",
            trigger: "blur",
          },
        ],
      },
      visible: true,
      plantId: "",
      workshopId: "",
      week: "",
      workshopList: [],
      lineList: [],
      lineId: "",
      isUserList: false,
      processList: [],
      processType: [],
    };
  },
  created() {
    this.getProcessType();
    if (this.isEdit) {
      this.form = this.editData;
      this.form.LineCodes = this.editData.LineCodes.split(",");
      this.plantId = this.editData.PlantId;
      this.workshopId = this.editData.WorkshopId;
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    getProcessType() {
      let params = {
        groupcode: "PROCESS_TYPE",
      };
      getParamData(params).then((res) => {
        if (res.data.success) {
          this.processType = res.data.data;
        }
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    isAgeingChange(value){
      this.form.IsAgeing = value.target.value;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          //编辑
          if (this.isEdit) {
            let editForm = {
              Id: this.form.Id,
              ProcessName: this.form.ProcessName,
              ProcessDesc: this.form.ProcessDesc,
              Step: this.form.Step,
              Enable: this.form.Enable,
              ProcessTypeCode:this.form.ProcessTypeCode,
              IsAgeing:this.form.IsAgeing
            };
            setProcess(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          } else {
            //添加
            console.log("this.form", this.form);
            setProcess(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
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
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-upload-list-item-name {
  white-space: normal;
}
</style>
