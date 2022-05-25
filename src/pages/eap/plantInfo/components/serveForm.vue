<template>
  <div>
    <a-modal :title="isEdit ? '编辑产线配置' : '添加产线配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
          <a-select v-model="form.PlantId" :disabled="isEdit" placeholder="请选择生产工厂" @change="plantChange">
            <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="WorkShopId" has-feedback label="生产车间" prop="WorkShopId">
          <a-select v-model="form.WorkShopId" :disabled="isEdit" placeholder="请选择生产工厂" @change="workshopChange">
            <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="LineId" has-feedback label="生产产线" prop="LineId">
          <a-select v-model="form.LineId" :disabled="isEdit" placeholder="请选择生产产线">
            <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="ServiceTypeCode" has-feedback label="服务配置类型" prop="ServiceTypeCode">
          <a-select v-model="form.ServiceTypeCode" :disabled="isEdit" placeholder="请选择服务配置类型">
            <a-select-option v-for="item in paramsList" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="ConfigCode" has-feedback label="服务配置编码" prop="ConfigCode">
          <a-input v-model="form.ConfigCode" allowClear placeholder="请输入服务配置编码" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item ref="ConfigName" has-feedback label="服务配置名称" prop="ConfigName">
          <a-input v-model="form.ConfigName" allowClear placeholder="请输入服务配置名称" />
        </a-form-model-item>
        <a-form-model-item ref="IPAddress" has-feedback label="服务ip" prop="IPAddress">
          <a-input v-model="form.IPAddress" allowClear placeholder="请输入服务ip" />
        </a-form-model-item>
        <a-form-model-item ref="PortNo" has-feedback label="端口号" prop="PortNo">
          <a-input-number min="0" v-model="form.PortNo" allowClear placeholder="请输入端口号" />
        </a-form-model-item>
        <a-form-model-item ref="Account" has-feedback label="连接账号" prop="Account">
          <a-input v-model="form.Account" allowClear placeholder="请输入连接账号" />
        </a-form-model-item>
        <a-form-model-item ref="Password" has-feedback label="连接密码" prop="Password">
          <a-input v-model="form.Password" allowClear placeholder="请输入连接密码" />
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
import { getPlantList, getWorkshopAction, setLineServiceAction } from "@/services/eap.js";
export default {
  props: ["editData", "isEdit", "paramsList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        LineId: "",
        WorkShopId: "",
        ServiceTypeCode: "",
        ConfigCode: "",
        ConfigName: "",
        IPAddress: "",
        PortNo: "",
        Account: "",
        Password: "",
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
        LineId: [
          {
            required: true,
            message: "请选择生产产线",
            trigger: "blur",
          },
        ],
        ServiceTypeCode: [
          {
            required: true,
            message: "请选择服务配置类型",
            trigger: "blur",
          },
        ],
        ConfigCode: [
          {
            required: true,
            message: "请输入服务配置编码",
            trigger: "blur",
          },
        ],
        ConfigName: [
          {
            required: true,
            message: "请输入服务配置名称",
            trigger: "blur",
          },
        ],
        IPAddress: [
          {
            required: true,
            message: "请输入服务ip",
            trigger: "blur",
          },
        ],
        PortNo: [
          {
            required: true,
            message: "请输入服务端口号",
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
      this.workshopChange(this.editData.WorkShopId);
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
      this.form.WorkShopId = "";
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
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              PlantId: this.form.PlantId,
              LineId: this.form.LineId,
              ServiceTypeCode: this.form.ServiceTypeCode,
              ConfigId: this.form.ConfigId,
              ConfigName: this.form.ConfigName,
              IPAddress: this.form.IPAddress,
              PortNo: this.form.PortNo,
              Account: this.form.Account,
              Password: this.form.Password,
              Enable: this.form.Enable,
            };
            setLineServiceAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setLineServiceAction(this.form, "add").then((res) => {
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
