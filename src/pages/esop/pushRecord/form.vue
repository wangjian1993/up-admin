<template>
  <div>
    <a-modal :title="isEdit ? '编辑记录' : '添加记录'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="document" has-feedback label="SOP文档" prop="document">
          <a-input v-model="form.document" allowClear placeholder="请选择SOP文档" disabled>
            <a-icon slot="addonAfter" type="plus" @click="isDocsList = true" :disabled="isEdit" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item ref="file" has-feedback label="推送文件" prop="file">
          <a-input v-model="form.file" allowClear placeholder="请选择推送文件" disabled>
            <a-icon slot="addonAfter" type="plus" @click="fileCLick" :disabled="isEdit" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item ref="equipment" has-feedback label="设备" prop="equipment">
          <a-input v-model="form.equipment" allowClear placeholder="请选择设备" disabled>
            <a-icon slot="addonAfter" type="plus" @click="isDevice = true" :disabled="isEdit" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
      <docsList v-if="isDocsList" @docsSuccess="docsSuccess" @closeModal="closeModal" />
      <file v-if="isFile" :docsItem="docsItem" @fileSuccess="fileSuccess" @closeModal="closeModal" />
      <deviceList v-if="isDevice" @deviceSuccess="deviceSuccess" @closeModal="closeModal" />
    </a-modal>
  </div>
</template>

<script>
import { setPushRecord } from "@/services/esop.js";
import docsList from "./docsList.vue";
import file from "./file.vue";
import deviceList from "./deviceList.vue";
export default {
  props: ["editData", "isEdit"],
  components: { docsList, file, deviceList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        document: "",
        file: "",
        equipment: "",
      },
      rules: {
        document: [
          {
            required: true,
            message: "请选择sop文档",
            trigger: "blur",
          },
        ],
        file: [
          {
            required: true,
            message: "请选择文件",
            trigger: "blur",
          },
        ],
        equipment: [
          {
            required: true,
            message: "请选择设备",
            trigger: "blur",
          },
        ],
      },
      docsItem: [],
      fileItem: [],
      deviceItem: [],
      isDocsList: false,
      isFile: false,
      isDevice: false,
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
      this.form.document = this.form.DocumentName;
      this.form.file = this.form.FileName;
      this.form.equipment = this.form.EquipmentName;
      this.docsItem.DocumentId = this.form.DocumentId;
      this.deviceItem.EquipmentId = this.form.EquipmentId;
      this.fileItem.ID = this.form.FileId;
    }
  },
  methods: {
    fileCLick() {
      if (this.docsItem == "") {
        this.$message.warning("请先选择SOP文档");
        return;
      }
      this.isFile = true;
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isDocsList = false;
      this.isFile = false;
      this.isDevice = false;
    },
    docsSuccess(list) {
      this.docsItem = list;
      this.form.document = list.DocumentName;
      this.deviceItem = [];
      this.form.equipment = "";
    },
    deviceSuccess(list) {
      this.deviceItem = list;
      this.form.equipment = list.EquipmentName;
    },
    fileSuccess(list) {
      this.fileItem = list;
      this.form.file = list.FileName;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      console.log("提交");
      this.$refs.ruleForm.validate((valid) => {
        console.log("valid", valid);
        if (valid) {
          let params = {
            documentid: this.docsItem.DocumentId,
            fileid: this.fileItem.ID,
            equipmentid: this.deviceItem.EquipmentId,
          };
          console.log("params==", params);
          if (this.isEdit) {
            params.id = this.form.Id;
            setPushRecord(params, "updatesendrecord").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            console.log("添加==");
            //添加
            setPushRecord(params, "addsendrecord").then((res) => {
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
