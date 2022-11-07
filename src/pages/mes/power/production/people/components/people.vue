<!--
 * @Author: max
 * @Date: 2021-11-29 15:04:20
 * @LastEditTime: 2022-10-28 16:48:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/people/components/people.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="添加人员配置" @cancel="close" @ok="handleOk" centered :width="600">
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
          <a-form-model-item ref="Lines" has-feedback label="生产产线" prop="Lines">
            <a-select v-model="form.Lines" mode="multiple" placeholder="请选择生产产线">
              <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineCode">{{ item.LineName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="UserCode" has-feedback label="用户" prop="UserId">
            <a-input v-model="form.UserCode" style="width: 150px" disabled placeholder="请选择用户" />
            <a-button type="primary" style="margin-left:10px" icon="plus" @click="addUser">
              添加
            </a-button>
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
      <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
    </a-modal>
  </div>
</template>

<script>
import { getPowerPlant, setPeople } from "@/services/mes.js";
import UserList from "@/components/app-user/UserList";
export default {
  components: { UserList },
  props: ["plantList", "editData", "isEdit"],
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        UserCode: "",
        PlantId: "",
        WorkshopId: "",
        Lines: [],
        Enable: "Y",
      },
      rules: {
        UserCode: [
          {
            required: true,
            message: "请选择用户",
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
        Lines: [
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
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
      this.form.Lines = this.editData.LineName;
      this.plantId = this.editData.PlantId;
      this.workshopId = this.editData.WorkshopId;
      this.form.Lines = this.editData.LineCode;
      this.getWorkshopList();
      this.getLineList();
    }
  },
  methods: {
    closeUserModal() {
      this.isUserList = false;
    },
    okUserModal(item) {
      this.isUserList = false;
      this.form.UserCode = item.Code;
    },
    //添加车间
    addUser() {
      this.isUserList = true;
    },
    //移除文件
    removeFile() {
      this.fileList = [];
    },
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    getWorkshopList() {
      let params = {
        plantid: this.plantId,
      };
      getPowerPlant(params, "workshop/getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let params = {
        plantid: this.plantId,
        workshopId: this.workshopId,
      };
      getPowerPlant(params, "line/getlist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    plantChange(e) {
      this.plantId = e;
      this.getWorkshopList();
      this.form.WorkshopId = "";
      this.form.Lines = "";
    },
    //车间选择
    workshopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.form.Lines = "";
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
            let editForm = {
              UserCode: this.form.UserCode,
              PlantId: this.form.PlantId,
              WorkshopId: this.form.WorkshopId,
              Lines: this.form.Lines.join(","),
              Enable: this.form.Enable,
            };
            setPeople(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          } else {
            //添加
            this.form.Lines = this.form.Lines.join(",");
            setPeople(this.form, "add").then((res) => {
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
