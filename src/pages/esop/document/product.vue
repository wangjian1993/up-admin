<!--
 * @Author: max
 * @Date: 2021-09-09 14:55:10
 * @LastEditTime: 2022-07-29 14:15:43
 * @LastEditors: max
 * @Description: 导入execl
 * @FilePath: /up-admin/src/pages/esop/document/product.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="上传产品图" @cancel="close" :footer="null" :maskClosable="false" centered :width="400">
      <a-spin tip="上传中..." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
                <a-col :md="8" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <div style="display:flex;">
                      <a-upload name="file" :custom-request="uploadFile" :fileList="fileList">
                        <a-button> <a-icon type="upload" />添加附件</a-button>
                      </a-upload>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { setSopDocumnet } from "@/services/esop.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
import md5 from "js-md5";
export default {
  props: ["previewRecord", "drawerItem"],
  data() {
    return {
      size: "small",
      visible: true,
      errorList: [],
      pagination: false,
      fileList: [],
      isUpload: false,
    };
  },
  created() {},
  methods: {
    //移除文件
    removeFile() {
      this.fileList = [];
      this.errorList = [];
    },
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
        let fileType = "";
        let fileSuffix = "";
        if (info.file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          fileType = "xlsx";
          fileSuffix = "xlsx";
        } else if (info.file.type == "application/msexcel") {
          fileType = "xls";
          fileSuffix = "xls";
        } else if (info.file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          fileType = "docx";
          fileSuffix = "docx";
        } else if (info.file.type == "application/msword") {
          fileType = "doc";
          fileSuffix = "doc";
        } else if (info.file.type == "application/pdf") {
          fileType = "pdf";
          fileSuffix = "pdf";
        } else {
          let defaType = info.file.type.split("/");
          fileType = defaType[0];
          fileSuffix = defaType[1];
        }
        let requestArray = [];
        let params = {
          id: this.drawerItem.DocumentId,
          filename: info.file.name,
          filetype: fileType,
          fileprefix: "",
          filesuffix: "." + fileSuffix,
          filesize: info.file.size,
          filelength: "0",
          filecontent: "",
          fileparentid:this.previewRecord.ID,
          fileclass:this.previewRecord.FileClass
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
              this.$message.success("上传成功!");
              this.$emit("close");
              this.$emit("success");
            }
          });
        });
      });
    },
    close() {
      this.$emit("close");
    },
  },
  components: {},
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
