<!--
 * @Author: max
 * @Date: 2022-03-28 11:25:07
 * @LastEditTime: 2022-03-31 16:09:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/document/form.vue
-->
<template>
  <div>
    <a-modal :title="isEdit ? '编辑文档' : '添加文档'" :visible="visible" v-if="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="840">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="文件编码" prop="documentcode" :labelCol="{ span: 6 }">
              <a-input :disabled="isEdit" v-model="form.documentcode" allowClear placeholder="请输入文件编码" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="文件名称" prop="documentname" :labelCol="{ span: 6 }">
              <a-input v-model="form.documentname" allowClear placeholder="请输入文件名称" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="plantid" has-feedback label="生产工厂" prop="plantid" :labelCol="{ span: 6 }">
              <a-select v-model="form.plantid" placeholder="请选择生产工厂">
                <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item ref="workcenterid" has-feedback label="生产产线" prop="workcenterid" :labelCol="{ span: 6 }">
              <a-select v-model="form.workcenterid" placeholder="请选择生产产线" @change="workShopChange">
                <a-select-option v-for="(item, index) in workshopList" :key="index" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item ref="lineid" has-feedback label="生产车间" prop="lineid" :labelCol="{ span: 6 }">
              <a-select v-model="form.lineid" placeholder="请选择生产车间">
                <a-select-option v-for="(item, index) in lineList" :key="index" :value="item.LineId">{{ item.LineName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-model-item label="版本号" prop="version" :labelCol="{ span: 6 }">
              <a-input v-model="form.version" allowClear placeholder="请输入版本号" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="产品大类" :labelCol="{ span: 6 }"><a-input v-model="form.protype" placeholder="请输入产品大类"/></a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="产品系列" :labelCol="{ span: 6 }"><a-input v-model="form.protypedetail" placeholder="请输入产品系列"/></a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="上传附件" :labelCol="{ span: 6 }">
              <a-upload :beforeUpload="beforeUpload" :custom-request="uploadFile" list-type="picture" :default-file-list="defFileList" :fileList="fileList" :remove="removeFile">
                <a-button> <a-icon type="upload" /> 选择附件 </a-button>
              </a-upload></a-form-model-item
            >
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setSopDocumnet, getSopDocument } from "@/services/esop.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: ["editData", "isEdit"],
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
      fileList: [],
      defFileList: [],
      fileData: [],
      FilePrefix: "",
      form: {
        documentcode: "",
        documentname: "",
        plantid: "",
        protype: "",
        protypedetail: "",
        version: "",
        filecount: "",
      },
      rules: {
        documentcode: [
          {
            required: true,
            message: "请输入文件编码",
            trigger: "blur",
          },
        ],
        documentname: [
          {
            required: true,
            message: "请输入文件名称",
            trigger: "blur",
          },
        ],
        plantid: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        version: [
          {
            required: true,
            message: "请输入版本号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getEnterList();
    if (this.isEdit) {
      this.getListAll();
    }
  },
  methods: {
    removeFile(record) {
      console.log(record);
      console.log(this.fileData);
      let paramsData = this.fileData.find((item) => item.uid == record.uid);
      console.log("paramsData",paramsData);
      let params = {
        resourceid: paramsData.ResourceId,
        filepath: paramsData.FilePath,
      };
      setSopDocumnet(params, "deletefile").then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.fileData.map((item, index) => {
            if (item.ID == record.ID) {
              this.fileData.splice(index, 1);
            }
          });
        }
      });
    },
    getListAll() {
      let parmas = {
        id: this.editData.DocumentId,
      };
      getSopDocument(parmas, "single").then((res) => {
        if (res.data.success) {
          console.log(res.data.data);
          let doc = res.data.data.doc;
          let files = res.data.data.files;
          files.forEach((item) => {
            this.defFileList.push({
              ...item,
              name: item.FileName,
              status: "done",
              url: item.FilePath,
              uid: item.ID,
            });
            this.fileData.push({
              FileName: item.FileName,
              FilePath: item.FilePath,
              FilePrefix: item.FilePrefix,
              ResourceId: item.ResourceId,
            });
          });
          this.form = {
            documentcode: doc.DocumentCode,
            documentname: doc.DocumentName,
            plantid: doc.PlantId,
            protypedetail: doc.ProTypeDetail,
            protype: doc.ProType,
            version: doc.Version,
            filecount: doc.FileCount,
          };
        }
      });
    },
    beforeUpload() {
      // const fileExt = file.name
      //   .split(".")
      //   .pop()
      //   .toLocaleLowerCase();
      // let fileList = [...this.fileList, file];
      // this.fileList = fileList.slice(-1);
      // this.isUpload = true;
      // this.file = file;
    },
    uploadFile(info) {
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl;
        let fileType = info.file.type.split("/");
        console.log("this.fileData", this.fileData);
        let parmas = {
          filename: info.file.name,
          filecontent: imageUrl,
          filetype: fileType[0],
          filesize: info.file.size,
          filesuffix: "." + fileType[1],
          filelength: 0,
        };
        if (this.fileData.length > 0) {
          parmas.FilePrefix = this.FilePrefix;
        }
        setSopDocumnet(parmas, "upload").then((res) => {
          console.log("fileList===", this.fileList);
          if (res.data.success) {
            this.fileList.push(info.file);
            this.$message.success("上传成功!");
            if (this.fileData.length == 0) {
              this.FilePrefix = res.data.data.FilePrefix;
            }
            let fileInfo = {
              ...res.data.data,
              ...info.file,
            };
            console.log("fileInfo", fileInfo);
            this.fileData.push(fileInfo);
          }
        });
        this.loading = false;
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.filecount = this.fileData.length;
          this.form.files = this.fileData;
          if (this.isEdit) {
            this.form.documentid = this.editData.DocumentId;
            setSopDocumnet(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
              }
            });
          } else {
            setSopDocumnet(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("success");
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.$emit("close");
    },
    //获取生产工厂
    getEnterList() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getSopDocument(parmas, "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
  },
  components: {},
};
</script>

<style>
.ant-form-item {
  margin-bottom: 5px;
}
</style>
