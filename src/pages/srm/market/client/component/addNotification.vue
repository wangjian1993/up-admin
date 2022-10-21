<template>
  <div>
    <a-modal :title="isEdit ? '编辑通知' : '添加通知'" v-if="visible" :visible="visible" destoryOnClose>
      <template slot="footer">
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" @click="handleOk('save')">
          保存
        </a-button>
        <a-button type="primary" @click="handleOk('send')">
          发送
        </a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="title" has-feedback label="标题" prop="title">
          <a-input v-model="form.title" allowClear placeholder="请输入标题" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="发件企业">
          <div>
            <a-tag style="margin:4px 4px" v-for="item in companyList" :key="item.Id" closable @close="() => handleClose(item.Id)">
              {{ item.Name }}
            </a-tag>
          </div>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addCompany"> <a-icon type="plus" /> 添加 </a-tag>
        </a-form-model-item>
        <a-form-model-item label="优先级">
          <a-radio-group v-model="form.priority">
            <a-radio value="重要">
              重要
            </a-radio>
            <a-radio value="一般">
              一般
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="content" label="通知内容" prop="content">
          <a-textarea v-model="form.content" placeholder="请输入通知内容" :auto-size="{ minRows: 3, maxRows: 5 }" />
          <a-upload list-type="picture" :custom-request="uploadFile" :default-file-list="fileList" :remove="removeFile" class="upload-list-inline">
            <a-button> <a-icon type="upload" /> 上传附件 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
      <CompanyList v-if="isCompany" @closeModal="closeModal" :companyList="companyList" @success="setCompanyList" />
    </a-modal>
  </div>
</template>

<script>
import { setClientNews, updateFile, deleteFile } from "@/services/srm.js";
import CompanyList from "./companyList.vue";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: ["editData", "isEdit"],
  components: { CompanyList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        id: "",
        title: "",
        priority: "",
        content: "",
        isconfirm: false,
        confirmcontent: "",
        isreturn: false,
        isall: false,
        companyids: [],
        files: [],
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      isCompany: false,
      companyList: [],
      fileList: [],
      filesList: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.filesList = [];
      this.form.title = this.editData.news.Title;
      this.form.priority = this.editData.news.Priority;
      this.form.content = this.editData.news.Content;
      this.form.isconfirm = this.editData.news.IsConfirm;
      this.form.confirmcontent = this.editData.news.ConfirmContent;
      this.form.isreturn = this.editData.news.IsReturn;
      this.form.isall = this.editData.news.IsAll;
      this.editData.files.forEach((file) => {
        let obj = {
          ...file,
          name: file.FileName,
          status: "done",
          url:file.Path,
          uid: file.Id,
        };
        this.fileList.push(obj);
        this.filesList.push({
          FileName: file.FileName,
          FilePath: file.Path,
          FilePrefix: file.FilePrefix,
          ResourceId: file.ResourceId,
          id: file.Id,
          uid: file.Id,
        });
      });
      console.log("filesList==", this.filesList);
      console.log("fileList==", this.fileList);
      this.editData.suppliers.forEach((item) => {
        this.companyList.push({
          Id: item.Id,
          Name: item.SupplierFullName,
        });
      });
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    addCompany() {
      this.isCompany = true;
    },
    closeModal() {
      this.isCompany = false;
    },
    setCompanyList(list) {
      this.companyList = list;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    removeFile(record) {
      console.log(record);
      console.log(this.filesList);
      let paramsData = this.filesList.find((item) => item.uid == record.uid);
      console.log("paramsData===", paramsData);
      let params = [paramsData.ResourceId];
      deleteFile(params).then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.filesList.map((item, index) => {
            if (item.uid == record.uid) {
              this.fileList.splice(index, 1);
              this[`${"fileList" + record.sort}`] = [];
            }
          });
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
            this.filesList.push({
              ...res.data.data,
              ...info.file,
              sort: info.data.sort,
            });
          }
          this.spinning = false;
        });
      });
    },
    handleOk(type) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.companyList.forEach((item) => {
              this.form.companyids.push(item.Id);
            });
            console.log(" this.filesList===", this.filesList);
            this.filesList.forEach((item) => {
              this.form.files.push(item.ResourceId);
            });
            this.form.id = this.editData.news.Id;
            console.log("this.form===", this.form);
            setClientNews(this.form, "save").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            this.companyList.forEach((item) => {
              this.form.companyids.push(item.Id);
            });
            console.log(" this.filesList===", this.filesList);
            this.filesList.forEach((item) => {
              this.form.files.push(item.ResourceId);
            });
            console.log("this.form===", this.form);
            setClientNews(this.form, type).then((res) => {
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
