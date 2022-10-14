<!--
 * @Author: max
 * @Date: 2021-11-29 15:04:20
 * @LastEditTime: 2022-10-13 17:16:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/components/craftForm.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="isEdit ? '编辑工艺路线' : '添加工艺路线'" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select style="width: 200px" placeholder="请选择生产工厂" v-model="form.PlantId">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="RoutingName" has-feedback label="工艺路线名称" prop="RoutingName">
            <a-input v-model="form.RoutingName" allowClear placeholder="请输入工艺路线名称" />
          </a-form-model-item>
          <a-form-model-item ref="RoutingCode" has-feedback label="工艺路线编码" prop="RoutingCode">
            <a-input v-model.trim="form.RoutingCode" allowClear placeholder="请输入工艺路线编码" :disabled="isEdit" />
          </a-form-model-item>
          <a-form-model-item ref="RoutingDesc" label="工序描述">
            <a-textarea v-model="form.RoutingDesc" placeholder="请输入工序描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
        <div style="margin-left:100px;margin-top: 40px;">
          <a-transfer :data-source="mockData" :titles="['工序名称', '工艺工序']" :target-keys="targetKeys" :selected-keys="selectedKeys" :render="(item) => item.title" :disabled="disabled" @change="handleChange" @selectChange="handleSelectChange" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { setCraft, getProcess } from "@/services/mes.js";
export default {
  props: ["plantList", "editData", "isEdit"],
  data() {
    return {
      mockData: [],
      targetKeys: [],
      selectedKeys: [],
      disabled: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        RoutingCode: "",
        RoutingName: "",
        RoutingDesc: "",
        Enable: "Y",
        RoutingDetails: [],
      },
      rules: {
        PlantId: [
          {
            required: true,
            message: "请输入生产工厂",
            trigger: "blur",
          },
        ],
        RoutingCode: [
          {
            required: true,
            message: "请输入工序路线编码",
            trigger: "blur",
          },
        ],
        RoutingName: [
          {
            required: true,
            message: "请输入工序路线名称",
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
    this.getProcessLine();
    if (this.isEdit) {
      this.form = this.editData;
      this.form.LineCodes = this.editData.LineCodes.split(",");
      this.plantId = this.editData.PlantId;
      this.workshopId = this.editData.WorkshopId;
    }
  },
  methods: {
    handleChange(nextTargetKeys, direction, moveKeys) {
      console.log("nextTargetKeys===", moveKeys);
      // this.targetKeys = nextTargetKeys.reverse();
      if (direction == "right") {
        moveKeys.map((item) => {
          this.targetKeys.push(item);
        });
      } else {
        this.targetKeys = nextTargetKeys;
      }

      // console.log("targetKeys: ", this.targetKeys);
      console.log("direction: ", direction);
      // console.log("moveKeys: ", moveKeys);
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
    },
    handleDisable(disabled) {
      this.disabled = disabled;
    },
    close() {
      this.$emit("closeModal");
    },
    getProcessLine() {
      let params = {
        pageindex: 1,
        pagesize: 100,
      };
      getProcess(params, "getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          list.forEach((item) => {
            this.mockData.push({
              ...item,
              key: item.Id,
              title: item.ProcessName,
              disabled: false,
            });
          });
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
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          //编辑
          if (this.isEdit) {
            let editForm = {
              Id: this.form.Id,
              ProcessName: this.form.ProcessName,
              ProcessDesc: this.form.ProcessDesc,
              Step: this.form.Step,
              Enable: this.form.Enable,
              ProcessTypeCode: this.form.ProcessTypeCode,
            };
            setCraft(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          } else {
            //添加
            console.log(" this.mockData", this.mockData);
            console.log(" this.targetKeys", this.targetKeys);
            this.mockData.forEach((item) => {
              if (this.targetKeys.includes(item.key)) {
                this.form.RoutingDetails.push({
                  ProcessId: item.Id,
                  Step: item.Step,
                });
              }
            });
            console.log(this.form);
            setCraft(this.form, "add").then((res) => {
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
