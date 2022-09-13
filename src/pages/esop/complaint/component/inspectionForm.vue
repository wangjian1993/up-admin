<!--
 * @Author: max
 * @Date: 2022-03-28 11:25:07
 * @LastEditTime: 2022-09-13 14:27:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/complaint/component/inspectionForm.vue
-->
<template>
  <div>
    <a-modal v-if="visible" :title="isEdit ? '编辑产品验货' : '添加产品验货'" :maskClosable="false" :visible="visible" destoryOnClose @ok="handleOk" :ok-button-props="{ props: { disabled: spinning } }" @cancel="handleCancel" :width="840">
      <a-spin tip="上传中" :spinning="spinning">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="日期" prop="uploaddatetime" :labelCol="{ span: 6 }">
                <a-date-picker @change="(e) => formattingDate(e, 'uploaddatetime')" v-model="form.uploaddatetime" allowClear placeholder="请选择日期" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="订单号" prop="orderno" :labelCol="{ span: 6 }"><a-input v-model="form.orderno" placeholder="请输入订单号"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="客户代码" prop="customercode" :labelCol="{ span: 6 }"><a-input v-model="form.customercode" placeholder="请输入客户代码"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="常规型号" prop="itemno" :labelCol="{ span: 6 }"><a-input :min="0" v-model="form.itemno" placeholder="请输入常规型号"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="客户型号" prop="customerno" :labelCol="{ span: 6 }"><a-input v-model="form.customerno" placeholder="请输入客户型号"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="不良现象" prop="unpleasantsight" :labelCol="{ span: 6 }"><a-input v-model="form.unpleasantsight" placeholder="请输入不良现象"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="后续执行标准" prop="executivestandard" :labelCol="{ span: 6 }">
                <a-textarea v-model="form.executivestandard" allowClear autosize placeholder="请输入后续执行标准" />
                <a-upload accept="image/jpg,image/jpeg,image/png" list-type="picture" :custom-request="uploadFile" :before-upload="beforeUpload" :default-file-list="fileList" :data="{ sort: 1 }" :remove="removeFile" class="upload-list-inline">
                  <a-button> <a-icon type="upload" /> 上传图片 </a-button>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
      <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
    </a-modal>
  </div>
</template>

<script>
import { setInspection, setSopDocumnet } from "@/services/esop.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
import md5 from "js-md5";
import UserList from "@/components/app-user/UserList";
import { lowerJSONKey } from "@/utils/util.js";
export default {
  props: ["editData", "isEdit"],
  components: { UserList },
  data() {
    return {
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      fileList: [],
      form: {
        uploaddatetime: "",
        orderno: "",
        customercode: "",
        itemno: "",
        customerno: "",
        unpleasantsight: "",
        executivestandard: "",
        files: [],
      },
      filesList: {},
      rules: {
        customercode: [
          {
            required: true,
            message: "请选择客户代码",
            trigger: "blur",
          },
        ],
        uploaddatetime: [
          {
            required: true,
            message: "请选择客诉日期",
            trigger: "change",
          },
        ],
        itemno: [
          {
            required: true,
            message: "请输入产品型号",
            trigger: "blur",
          },
        ],
        customerno: [
          {
            required: true,
            message: "请输入客户型号",
            trigger: "blur",
          },
        ],
        orderno: [
          {
            required: true,
            message: "请输入订单号",
            trigger: "blur",
          },
        ],
        unpleasantsight: [
          {
            required: true,
            message: "请输入不良现象",
            trigger: "blur",
          },
        ],
        executivestandard: [
          {
            required: true,
            message: "请输入执行标准",
            trigger: "blur",
          },
        ],
      },
      spinning: false,
      department: [],
      isUserList: false,
    };
  },
  created() {
    if (this.isEdit) {
      this.form = lowerJSONKey(this.editData);
      this.$nextTick(() => {
        this.form.files.forEach((item) => {
          let obj = {
            ...item,
            name: item.FileName,
            status: "done",
            url: item.FilePath,
            uid: item.Id,
          };
          this.fileList.push(obj);
          this.filesList = {
            FileName: item.FileName,
            FilePath: item.FilePath,
            FilePrefix: item.FilePrefix,
            ResourceId: item.Id,
            sort: item.Sort,
            id: item.Id,
            uid: item.Id,
          };
        });
        this.form.files = []
      });
    }
  },
  methods: {
    formattingDate(e, str) {
      console.log(e);
      this.form[str] = e.format("YYYY-MM-DD");
    },
    removeFile() {
      let params = {
        resourceid: this.filesList.ResourceId,
        filepath: this.filesList.FilePath,
      };
      setSopDocumnet(params, "deletefile").then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.filesList = {};
        }
      });
    },
    beforeUpload(file) {
      let fileList = [...this.fileList, file];
      this.fileList = fileList.slice(-1);
      this.isImage(file);
    },
    //判断上传图片类型
    isImage(file) {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("请图片类型文件!");
      }
      return isJpgOrPng;
    },
    //切割字符串
    group(string) {
      let r = [];
      let chunkSize = 10 * 1024 * 1024;
      let chunkCount = Math.ceil(string.length / chunkSize);
      for (let i = 0; i < chunkCount; i++) {
        let start = i * chunkSize;
        let end = Math.min(string.length, start + chunkSize);
        console.log("start", start);
        console.log("end", end);
        r.push(string.slice(start, end));
      }
      return r;
    },
    uploadRequest(params) {
      return new Promise((resolve) => {
        setSopDocumnet(params, "upload").then((res) => {
          if (res.data.success) {
            resolve(res.data);
          }
        });
      });
    },
    //总sop 文档上传
    uploadFile(info) {
      this.spinning = true;
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl;
        let fileMd5 = md5(imageUrl);
        let str = this.group(imageUrl, 5000000);
        let defaType = info.file.type.split("/");
        let fileType = defaType[0];
        let fileSuffix = defaType[1];
        let requestArray = [];
        let params = {
          filename: info.file.name,
          filetype: fileType,
          fileprefix: "",
          filesuffix: "." + fileSuffix,
          filesize: info.file.size,
          filelength: "0",
          filecontent: "",
        };
        str.forEach((item, index) => {
          params.filechunk = {
            identifier: fileMd5,
            totalChunks: str.length,
            chunkNumber: index + 1,
            content: item,
          };
          let result = this.uploadRequest(params);
          requestArray.push(result);
        });
        Promise.all(requestArray).then((res) => {
          console.log("res===", res);
          params.filechunk = {
            identifier: fileMd5,
            totalChunks: str.length,
          };
          setSopDocumnet(params, "upload/composefile").then((res) => {
            if (res.data.success) {
              this.filesList = res.data.data;
            }
            this.spinning = false;
          });
        });
      });
    },
    //部门选择
    onChange(value) {
      console.log(value);
      this.form.departid = value[value.length - 1];
    },
    displayRender({ labels }) {
      return labels[labels.length - 1];
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.spinning = true;
          this.form.files = []
          this.form.files.push({
            id: this.filesList.ResourceId,
          });
          if (this.isEdit) {
            this.form.id = this.editData.id;
            setInspection(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
                this.$emit("close");
                this.spinning = false;
              }
            });
          } else {
            setInspection(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("success");
                this.$emit("close");
                this.spinning = false;
              } else {
                this.spinning = false;
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.form = [];
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 10px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.uploadImg {
  width: 128px;
  height: 128px;
}
.ant-form-.has-error .ant-form-explain {
  font-size: 10px;
}
</style>
