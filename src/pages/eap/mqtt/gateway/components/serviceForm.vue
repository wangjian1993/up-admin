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
        <a-form-model-item ref="servercode" has-feedback label="服务编码" prop="servercode">
          <a-input v-model="form.servercode" allowClear placeholder="请输入服务编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="servername" has-feedback label="服务名称" prop="servername">
          <a-input v-model="form.servername" allowClear placeholder="请输入服务名称" />
        </a-form-model-item>
        <a-form-model-item ref="serverip" has-feedback label="服务IP" prop="serverip">
          <a-input v-model="form.serverip" allowClear placeholder="请输入服务IP" />
        </a-form-model-item>
        <a-form-model-item ref="serverpost" has-feedback label="端口号" prop="serverpost">
          <a-input-number :min="0" v-model="form.serverpost" allowClear placeholder="请输入端口号" />
        </a-form-model-item>
        <a-form-model-item ref="servertype" label="服务类型" prop="servertype">
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
        <a-form-model-item ref="serverusername" has-feedback label="服务账号" prop="serverusername">
          <a-input v-model="form.serverusername" allowClear placeholder="请输入服务账号" />
        </a-form-model-item>
        <a-form-model-item ref="serverpassword" has-feedback label="服务密码" prop="serverpassword">
          <a-input v-model="form.serverpassword" allowClear placeholder="请输入服务密码" />
        </a-form-model-item>
        <a-form-model-item ref="isautostart" has-feedback label="自动启动" prop="isautostart"> <a-switch v-model="form.isautostart" /> </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getPlantList, getWorkshopAction, setMqttServiceAction } from "@/services/eap.js";
export default {
  props: ["editData", "isEdit"],
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
        servercode: "",
        servername: "",
        serverip: "",
        serverpost: "",
        servertype: "",
        serverusername: "",
        serverpassword: "",
        path: "",
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
        servercode: [
          {
            required: true,
            message: "请输入服务编码",
            trigger: "blur",
          },
        ],
        servername: [
          {
            required: true,
            message: "请输入服务名称",
            trigger: "blur",
          },
        ],
        serverip: [
          {
            required: true,
            message: "请输入服务ip",
            trigger: "blur",
          },
        ],
        serverpost: [
          {
            required: true,
            message: "请输入服务端口",
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
        servercode: this.editData.ServerCode,
        servername: this.editData.ServerName,
        serverip: this.editData.ServerIP,
        serverpost: this.editData.ServerPort,
        servertype: this.editData.ServerType,
        serverusername: this.editData.ServerUsername,
        serverpassword: this.editData.ServerPassword,
        path: this.editData.Path,
        isautostart: this.editData.IsAutoStart,
      };
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
      this.initialize()
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
    initialize() {
      this.form = {
        plantid: "",
        workshopid: "",
        lineid: "",
        servercode: "",
        servername: "",
        serverip: "",
        serverpost: "",
        servertype: "",
        serverusername: "",
        serverpassword: "",
        path: "",
        isautostart: false,
      };
      console.log(this.form);
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.isautostart = this.form.isautostart ? "Y" : "N";
            let editForm = {
              id: this.editData.Id,
              ...this.form,
            };
            setMqttServiceAction(editForm, "update").then((res) => {
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
            let parmas = [this.form, {}];
            setMqttServiceAction(parmas, "add").then((res) => {
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
