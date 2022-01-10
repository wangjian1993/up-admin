<!--
 * @Author: max
 * @Date: 2021-11-29 15:04:20
 * @LastEditTime: 2022-01-10 18:06:42
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/processLine/addForm.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="isEdit?'编辑工序产线':'添加工序产线'" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select v-model="form.PlantId" placeholder="请选择生产工厂" @change="plantChange">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="WorkshopId" has-feedback label="生产车间" prop="WorkshopId">
            <a-select v-model="form.WorkshopId" placeholder="请选择生产车间" @change="workshopChange">
              <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="LineCodes" has-feedback label="生产产线" prop="LineCodes">
            <a-select v-model="form.LineCodes" mode="multiple" placeholder="请选择生产产线">
              <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineCode">{{ item.LineName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="ProcessId" has-feedback label="工序" prop="ProcessId">
            <a-select v-model="form.ProcessId" placeholder="请选择工序">
              <a-select-option v-for="item in processList" :key="item.Id" :value="item.Id">{{ item.ProcessName }}</a-select-option>
            </a-select>
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
import { getWorkshopList, getLineList, setProcessLine, getProcessLine } from "@/services/web.js";
export default {
  props: ["plantList", "editData", "isEdit"],
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        ProcessId: "",
        WorkshopId: "",
        LineCodes: [],
        Enable: "Y",
      },
      rules: {
        ProcessId: [
          {
            required: true,
            message: "请选择工序",
            trigger: "blur",
          },
        ],
        PlantId: [
          {
            required: true,
            message: "请输入生产工厂",
            trigger: "blur",
          },
        ],
        WorkshopId: [
          {
            required: true,
            message: "请选择生产车间",
            trigger: "blur",
          },
        ],
        LineCodes: [
          {
            required: true,
            message: "请选择生产产线",
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
    };
  },
  created() {
    this.getListAll();
    if(this.isEdit){
      this.form = this.editData;
      this.form.LineCodes = this.editData.LineCodes.split(",")
      this.plantId = this.editData.PlantId;
      this.workshopId =this.editData.WorkshopId
      this.getWorkshopList();
      this.getLineList();
    }
  },
  methods: {
    getListAll() {
      let parmas = {
        pageindex: 1,
        pagesize: 100,
      };
      getProcessLine(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.processList = res.data.data.list;
        }
      });
    },
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    getWorkshopList() {
      let parmas = {
        plantid: this.plantId,
      };
      getWorkshopList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantId,
        workshopId: this.workshopId,
      };
      getLineList(parmas).then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    plantChange(e) {
      this.plantId = e;
      this.getWorkshopList();
      this.form.WorkshopId = "";
      this.form.LineCodes = [];
    },
    //车间选择
    workshopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.form.LineCodes = [];
    },
    //产线选择
    lineChange(e) {
      this.lineId = e;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //编辑
          if (this.isEdit) {
            console.log(this.form);
            let editForm = {
              PlantId: this.form.PlantId,
              ProcessId: this.form.ProcessId,
              WorkshopId: this.form.WorkshopId,
              LineCodes: this.form.LineCodes.join(","),
              Enable:this.form.Enable
            };
            console.log("编辑====",editForm)
            setProcessLine(editForm, "line/update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          } else {
            //添加
            this.form.LineCodes = this.form.LineCodes.join(",");
            setProcessLine(this.form, "line/add").then((res) => {
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
