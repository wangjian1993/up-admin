<template>
  <div>
    <a-modal :title="isEdit ? '编辑MQTT配置' : '添加MQTT配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="plantid" has-feedback label="生产工厂" prop="plantid">
          <a-select v-model="form.plantid" :disabled="isEdit" placeholder="请选择生产工厂" @change="plantChange">
            <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="workshopid" has-feedback label="生产车间" prop="workshopid">
          <a-select v-model="form.workshopid" :disabled="isEdit" placeholder="请选择生产工厂" @change="workshopChange">
            <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="lineid" has-feedback label="生产产线" prop="lineid">
          <a-select v-model="form.lineid" :disabled="isEdit" placeholder="请选择生产产线">
            <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="clientcode" has-feedback label="客服端编码" prop="clientcode">
          <a-input v-model="form.clientcode" allowClear placeholder="请输入客服端编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="clientname" has-feedback label="客服端名称" prop="clientname">
          <a-input v-model="form.clientname" allowClear placeholder="请输入客服端名称" />
        </a-form-model-item>
        <a-form-model-item ref="serverid" has-feedback label="MQTT服务器" prop="serverid">
          <a-select v-model="form.serverid" :disabled="isEdit" placeholder="请选择MQTT服务器">
            <a-select-option v-for="item in serviceList" :key="item.Id" :value="item.Id">{{ item.ServerName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="equipment" has-feedback label="关联设备" prop="equipment">
          <a-select v-model="form.equipment" :disabled="isEdit" placeholder="请选择关联设备">
            <a-select-option v-for="item in deviceList" :key="item.EquimentId" :value="item.EquimentId">{{ item.EquimentName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="servertype" label="客服端类型" prop="servertype">
          <a-select v-model="form.servertype" placeholder="请选择协议类型">
            <a-select-option value="HTTP">
              HTTP
            </a-select-option>
            <a-select-option value="TCP">
              TCP
            </a-select-option>
            <a-select-option value="WS">
              WS
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="path" has-feedback label="执行路径" prop="path">
          <a-input v-model="form.path" allowClear placeholder="请输入执行路径" />
        </a-form-model-item>
        <a-form-model-item ref="isautostart" has-feedback label="自动启动" prop="isautostart"> <a-switch v-model="form.isautostart" /> </a-form-model-item>
        <a-form-model-item ref="isautoconnect" has-feedback label="自动连接" prop="isautoconnect"> <a-switch v-model="form.isautoconnect" /> </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getPlantList, getWorkshopAction, setMqttClientAction } from "@/services/eap.js";
export default {
  props: ["editData", "isEdit", "deviceList", "serviceList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        plantid: "",
        workshopid: "",
        lineid: "",
        clientcode: "",
        clientname: "",
        equipment: "",
        servertype: "",
        serverid: "",
        path: "",
        isautoconnect: false,
        isautostart: false,
      },
      rules: {
        plantid: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        workshopid: [
          {
            required: true,
            message: "请选择生产车间",
            trigger: "blur",
          },
        ],
        lineid: [
          {
            required: true,
            message: "请选择生产产线",
            trigger: "blur",
          },
        ],
        clientcode: [
          {
            required: true,
            message: "请输入客服端编码",
            trigger: "blur",
          },
        ],
        clientname: [
          {
            required: true,
            message: "请输入客服端名称",
            trigger: "blur",
          },
        ],
        equipment: [
          {
            required: true,
            message: "请选择关联设备",
            trigger: "blur",
          },
        ],
        serverid: [
          {
            required: true,
            message: "请选择MQTT服务器",
            trigger: "blur",
          },
        ],
        servertype: [
          {
            required: true,
            message: "请选择协议类型",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            message: "请输入执行路径",
            trigger: "blur",
          },
        ],
      },
      plantList: [],
      workshopList: [],
      lineList: [],
      plantId: "",
    };
  },
  created() {
    this.getPlant();
    if (this.isEdit) {
      this.plantChange(this.editData.PlantId);
      this.plantId = this.editData.PlantId;
      this.workshopChange(this.editData.WorkCenterId);
      this.form = {
        plantid: this.editData.PlantId,
        workshopid: this.editData.WorkCenterId,
        lineid: this.editData.LineId,
        clientcode: this.editData.ClientCode,
        clientname: this.editData.ClientName,
        equipment: this.editData.EquipmentId,
        servertype: this.editData.ServerType,
        serverid: this.editData.ServerId,
        path: this.editData.Path,
        isautostart: this.editData.IsAutoStart,
        isautoconnect: this.editData.IsAutoConnect,
      };
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
      this.initialize();
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
    plantChange(e) {
      this.plantId = e;
      this.form.workshopid = "";
      let parmas = {
        plantid: e,
      };
      getWorkshopAction(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    workshopChange(e) {
      let parmas = {
        plantid: this.plantId,
        workshopid: e,
      };
      getPlantList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    handleCancel() {
      this.$emit("closeModal");
      // this.initialize()
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.isautostart = this.form.isautostart ? "Y" : "N";
            this.form.isautoconnect = this.form.isautoconnect ? "Y" : "N";
            let editForm = {
              id: this.editData.Id,
              ...this.form,
            };
            setMqttClientAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            console.log(this.form);
            this.form.isautostart = this.form.isautostart ? "Y" : "N";
            this.form.isautoconnect = this.form.isautoconnect ? "Y" : "N";
            let parmas = [this.form, {}];
            setMqttClientAction(parmas, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          }
          // this.initialize()
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
