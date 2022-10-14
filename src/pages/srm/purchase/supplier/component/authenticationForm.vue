<template>
  <div>
    <a-modal title="编辑资质文件" v-if="visible" :visible="visible" @cancel="close" @ok="handleOk" destoryOnClose>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="资质文件编码" prop="code">
          <a-input v-model="form.code" allowClear placeholder="请输入资质文件编码" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="标题" prop="name">
          <a-input v-model="form.name" allowClear placeholder="请输入标题" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="供应商">
          <a-input v-model="editData.SupplierFullName" allowClear disabled />
        </a-form-model-item>
        <a-form-model-item ref="isrequired" label="是否必要">
          <a-checkbox v-model="form.isrequired"> </a-checkbox>
        </a-form-model-item>
        <a-form-model-item ref="isfilerequired" label="文件到期必填">
          <a-checkbox v-model="form.isfilerequired"> </a-checkbox>
        </a-form-model-item>
        <a-form-model-item ref="isconfirm" label="文件到期日">
          <text></text>
        </a-form-model-item>
        <a-form-model-item label="有效期">
          <a-select v-model="form.expiredlength">
            <a-select-option :value="item" v-for="(item, index) in expiry" :key="index">{{ item }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="content" label="模板文件" prop="content">
          <a-upload list-type="picture" :custom-request="uploadFile" :default-file-list="fileList" :remove="removeFile" class="upload-list-inline">
            <a-button> <a-icon type="upload" /> 上传附件 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setAuthentication, updateFile, deleteFile } from "@/services/srm.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        id: "",
        code: "",
        name: "",
        expiredlength: "长期",
        isrequired: false,
        isfilerequired: false,
        fileid: [],
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入文件编码",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
      },
      fileList: [],
      filesList: {},
      expiry: ["长期", "半年", "一年", "两年", "三年"],
    };
  },
  created() {},
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isCompany = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    removeFile() {
      let params = [this.filesList.ResourceId];
      deleteFile(params).then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.fileList = [];
          this.filesList = {};
        }
      });
    },
    uploadFile(info) {
      this.spinning = true;
      getBase64(info.file, (result) => {
        let defaType = info.file.type.split("/");
        let fileType = defaType[0];
        let fileSuffix = defaType[1];
        let params = {
          filename: info.file.name,
          filetype: fileType,
          fileprefix: "",
          filesuffix: "." + fileSuffix,
          filesize: info.file.size,
          filelength: "0",
          filecontent: result,
        };
        updateFile(params).then((res) => {
          if (res.data.success) {
            this.filesList = {
              ...res.data.data,
              ...info.file,
              sort: info.data.sort,
            };
          }
          this.spinning = false;
        });
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.fileid = this.filesList.ResourceId;
          this.form.id = this.editData.Id;
          setAuthentication(this.form, "update").then((res) => {
            if (res.data.success) {
              this.$message.success("编辑成功!");
              this.$emit("closeModal");
              this.$emit("success");
              this.visible = false;
            }
          });
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
