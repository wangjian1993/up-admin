<template>
  <a-modal v-if="visible" title="推送客诉" :visible="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="500">
    <a-spin tip="推送中..." :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item ref="plantid" has-feedback label="生产工厂" prop="plantid" :labelCol="{ span: 6 }">
              <a-select placeholder="请选择生产工厂" @change="plantChange">
                <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="workcenterid" has-feedback label="生产车间" prop="workcenterid" :labelCol="{ span: 6 }">
              <a-select placeholder="请选择生产车间" @change="workShopChange">
                <a-select-option v-for="(item, index) in workshopList" :key="index" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item ref="lineid" has-feedback label="生产产线" prop="lineid" :labelCol="{ span: 6 }">
              <a-select v-model="form.lineid" placeholder="请选择生产产线">
                <a-select-option v-for="(item, index) in lineList" :key="index" :value="item.LineId">{{ item.LineName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { setPushRecord, getSopDocument } from "@/services/esop.js";
export default {
  props: ["sendData"],
  data() {
    return {
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      plantid: "", //工厂
      plantList: [],
      workshopList: [],
      workshopId: "", //车间
      lineList: [],
      spinning: false,
      form: {
        lineid: "",
      },
      rules: {
        lineid: [
          {
            required: true,
            message: "请选择生产产线",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getEnterList();
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.spinning = true;
          let params = {
            ids: this.sendData,
            lineid: this.form.lineid,
          };
          setPushRecord(params, "mqtt/publishcomplain").then((res) => {
            if (res.data.success) {
              this.$message.success("推送成功!");
              this.$emit("closeModal");
              this.spinning = false;
            }
          });
        }
      });
    },
    handleCancel() {
      this.$emit("closeModal");
      this.visible = false;
    },
    //工厂选择
    plantChange(e) {
      this.plantid = e;
      this.getWorkshopList();
      this.form.workcenterid = "";
      this.form.lineid = "";
    },
    //车间选择
    workShopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.form.lineid = "";
    },
    //获取生产工厂
    getEnterList() {
      let params = {
        entertypecode: "PLANT",
      };
      getSopDocument(params, "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let params = {
        plantid: this.plantid,
      };
      getSopDocument(params, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let params = {
        plantid: this.plantid,
        workshopid: this.workshopId,
      };
      getSopDocument(params, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
