<!--
 * @Author: max
 * @Date: 2022-03-28 11:25:07
 * @LastEditTime: 2022-05-12 13:53:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/document/form.vue
-->
<template>
  <div>
    <a-modal v-if="visible" :title="isEdit ? '编辑文档' : '添加文档'" :visible="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="840">
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
            <a-form-model-item label="版本号" prop="version" :labelCol="{ span: 6 }">
              <a-input v-model="form.version" allowClear placeholder="请输入版本号" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-model-item label="产品大类" :labelCol="{ span: 6 }"><a-input v-model="form.protype" placeholder="请输入产品大类"/></a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="产品系列" :labelCol="{ span: 6 }"><a-input v-model="form.protypedetail" placeholder="请输入产品系列"/></a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="工序数量" :labelCol="{ span: 6 }"><a-input-number :min="1" v-model="processValue" placeholder="请输入工序" @change="processChange"/></a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="SOP文档" :labelCol="{ span: 3 }">
              <a-upload :custom-request="uploadFile1" :before-upload="beforeUpload" list-type="picture-card" :default-file-list="defFileList1" :fileList="processList1" :remove="removeFile1"> <a-icon type="plus" /> </a-upload
            ></a-form-model-item>
            <div v-for="(item, index) in processValue" :key="index">
              <a-form-model-item :label="'工序' + (index + 1)" :labelCol="{ span: 3 }">
                <a-upload :data="{ sort: index + 1 }" :custom-request="uploadFile" list-type="picture-card" :default-file-list="defFileList['sort' + (index + 1)]" :fileList="processList['sort' + (index + 1)]" :remove="removeFile"> <a-icon type="plus" /> </a-upload
              ></a-form-model-item>
            </div>
            <!-- <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :default-file-list="defFileList.sort1">
              <a-button> <a-icon type="upload" /> Upload </a-button>
            </a-upload> -->
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
      defFileList: {},
      fileData: [],
      fileData1: [],
      FilePrefix: "",
      processValue: 0,
      processList: {
        sort1: [],
      },
      form: {
        documentcode: "",
        documentname: "",
        plantid: "",
        protype: "",
        protypedetail: "",
        version: 1,
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
      sortValue: 1,
      processList1: [],
      defFileList1: [],
    };
  },
  mounted() {
    if (this.isEdit) {
      this.getListAll();
    }
  },
  created() {
    this.getEnterList();
  },
  methods: {
    removeFile1() {
      let params = {
        resourceid: this.fileData1[0].ResourceId,
        filepath: this.fileData1[0].FilePath,
      };
      setSopDocumnet(params, "deletefile").then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.fileData1 = [];
        }
      });
    },
    removeFile(record) {
      let paramsData = this.fileData.find((item) => item.id == record.uid);
      let params = {
        resourceid: paramsData.ResourceId,
        filepath: paramsData.FilePath,
      };
      setSopDocumnet(params, "deletefile").then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.fileData.map((item, index) => {
            if (item.id == record.uid) {
              this.fileData.splice(index, 1);
            }
          });
          this.processList["sort" + paramsData.sort].forEach((item, index) => {
            if (item.uid == record.uid) {
              this.processList["sort" + paramsData.sort].splice(index, 1);
            }
          });
        }
      });
    },
    processChange(e) {
      if (e > this.sortValue) {
        this.sortValue = e;
        this.processList["sort" + this.sortValue] = [];
      } else {
        console.log(typeof this.processList);
        delete this.processList["sort" + this.sortValue];
      }
      this.sortValue = e;
    },
    getListAll() {
      let parmas = {
        id: this.editData.DocumentId,
      };
      getSopDocument(parmas, "single").then((res) => {
        if (res.data.success) {
          let doc = res.data.data.doc;
          let files = res.data.data.files;
          if (doc.ProcessCount > 0) {
            for (let index = 1; index <= doc.ProcessCount; index++) {
              this.defFileList["sort" + index] = [];
              this.processList["sort" + index] = [];
            }
          }
          files.forEach((item) => {
            if (item.Sort == 0) {
              this.processList1.push({
                ...item,
                name: item.FileName,
                status: "done",
                url: item.FilePath,
                uid: item.ID,
              });
              this.defFileList1.push({
                ...item,
                name: item.FileName,
                status: "done",
                url: item.FilePath,
                uid: item.ID,
              });
            } else {
              this.processList["sort" + item.Sort].push({
                ...item,
                name: item.FileName,
                status: "done",
                url: item.FilePath,
                uid: item.ID,
              });
              this.defFileList["sort" + item.Sort].push({
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
                sort: item.Sort,
                id: item.ID,
              });
            }
          });
          this.processValue = doc.ProcessCount;
          console.log(doc);
          this.form = {
            documentcode: doc.DocumentCode,
            documentname: doc.DocumentName,
            plantid: doc.PlantId,
            protypedetail: doc.ProTypeDetail,
            protype: doc.ProType,
            version: doc.Version,
            filecount: doc.FileCount,
          };
          console.log(this.defFileList);
        }
      });
    },
    beforeUpload(file) {
      let fileList = [...this.defFileList1, file];
      this.defFileList1 = fileList.slice(-1);
    },
    //总sop 文档上传
    uploadFile1(info) {
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl;
        console.log(info.file);
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
        let parmas = {
          filename: info.file.name,
          filecontent: imageUrl,
          filetype: fileType,
          filesize: info.file.size,
          filesuffix: "." + fileSuffix,
          filelength: 0,
        };
        if (this.fileData1.length > 0) {
          parmas.FilePrefix = this.FilePrefix;
        }
        setSopDocumnet(parmas, "upload").then((res) => {
          if (res.data.success) {
            this.processList1.push({
              name: info.file.name,
              status: "done",
              uid: info.file.uid,
            });
            this.$message.success("上传成功!");
            if (this.fileData1.length == 0) {
              this.FilePrefix = res.data.data.FilePrefix;
            }
            let fileInfo = {
              ...res.data.data,
              ...info.file,
              sort: 0,
            };
            this.fileData1.push(fileInfo);
            console.log(" this.fileData", this.fileData1);
          }
        });
        this.loading = false;
      });
    },
    uploadFile(info) {
      console.log("info", info);
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl;
        console.log(info.file);
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
        let parmas = {
          filename: info.file.name,
          filecontent: imageUrl,
          filetype: fileType,
          filesize: info.file.size,
          filesuffix: "." + fileSuffix,
          filelength: 0,
        };
        if (this.fileData.length > 0) {
          parmas.FilePrefix = this.FilePrefix;
        }
        setSopDocumnet(parmas, "upload").then((res) => {
          if (res.data.success) {
            this.processList["sort" + info.data.sort].push({
              name: info.file.name,
              status: "done",
              uid: info.file.uid,
            });
            this.$message.success("上传成功!");
            if (this.fileData.length == 0) {
              this.FilePrefix = res.data.data.FilePrefix;
            }
            let fileInfo = {
              ...res.data.data,
              ...info.file,
              sort: info.data.sort,
            };
            this.fileData.push(fileInfo);
            console.log(" this.fileData", this.fileData);
          }
        });
        this.loading = false;
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.filecount = this.fileData.length + 1;
          this.form.files = this.fileData;
          this.form.files.unshift(this.fileData1[0]);
          this.form.processcount = this.processValue;
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
          this.form = [];
          this.processcount = 1;
          this.defFileList = {};
          this.processList = {};
          this.fileData = [];
        }
      });
    },
    handleCancel() {
      this.form = [];
      this.processcount = 1;
      this.defFileList = {};
      this.processList = {};
      this.fileData = [];
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
