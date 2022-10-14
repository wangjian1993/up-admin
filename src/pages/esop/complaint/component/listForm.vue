<!--
 * @Author: max
 * @Date: 2022-03-28 11:25:07
 * @LastEditTime: 2022-09-24 10:00:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/complaint/component/listForm.vue
-->
<template>
  <div>
    <a-modal v-if="visible" :title="isEdit ? '编辑客诉' : '添加客诉'" :maskClosable="false" :visible="visible" destoryOnClose @ok="handleOk" :ok-button-props="{ props: { disabled: spinning } }" @cancel="handleCancel" :width="840">
      <a-spin tip="上传中" :spinning="spinning">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="客诉日期" prop="uploaddatetime" :labelCol="{ span: 6 }">
                <a-date-picker @change="(e) => formattingDate(e, 'uploaddatetime')" v-model="form.uploaddatetime" allowClear placeholder="请选择客诉日期" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="客户名称" prop="customername" :labelCol="{ span: 6 }">
                <a-input v-model="form.customername" allowClear placeholder="请输入客户名称" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="业务员" prop="businessuser" :labelCol="{ span: 6 }"><a-input v-model="form.businessuser" disabled style="width: 180px" placeholder="请选择业务员"/> <a-button style="margin-left: 8px" type="primary" @click="isUserList = true" icon="plus"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="订单号" prop="orderno" :labelCol="{ span: 6 }"><a-input v-model="form.orderno" placeholder="请输入订单号"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="产品型号" prop="itemcode" :labelCol="{ span: 6 }"><a-input v-model="form.itemcode" placeholder="请输入产品型号"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="产品类别" prop="itemtype" :labelCol="{ span: 6 }"><a-input :min="0" v-model="form.itemtype" placeholder="请输入产品类别"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="出货日期" prop="saledatetime" :labelCol="{ span: 6 }">
                <a-date-picker v-model="form.saledatetime" allowClear placeholder="请选择出货日期" @change="(e) => formattingDate(e, 'saledatetime')" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="责任部门" prop="departid" :labelCol="{ span: 6 }"><a-cascader :options="department" :default-value="departName" :display-render="displayRender" :fieldNames="fieldNames" expand-trigger="hover" placeholder="请选择责任部门" @change="onChange"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="订单数量" prop="qty" :labelCol="{ span: 6 }"> <a-input-number style="width:150px" @change="rateChange" :min="0" v-model="form.qty" placeholder="请输入订单数量"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="不良数量" prop="ngqty" :labelCol="{ span: 6 }"
                ><a-input-number :min="0" style="width:120px" :max="form.qty" @change="rateChange" v-model="form.ngqty" placeholder="请输入不良数量" /><span>不良率:{{ form.ngrate }}%</span></a-form-model-item
              >
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="8D回复日期" prop="reportdatetime" :labelCol="{ span: 6 }">
                <a-date-picker v-model="form.reportdatetime" allowClear placeholder="请选择8D回复日期" @change="(e) => formattingDate(e, 'reportdatetime')" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="8D报告号" prop="reportno" :labelCol="{ span: 6 }"><a-input v-model="form.reportno" placeholder="请输入8D报告号"/></a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="不良描述" prop="ngdesc" :labelCol="{ span: 6 }">
                <a-textarea v-model="form.ngdesc" allowClear autosize placeholder="请输入不良描述" />
                <a-upload accept="image/jpg,image/jpeg,image/png" list-type="picture" :custom-request="uploadFile" :before-upload="beforeUpload1" :default-file-list="fileList1" :data="{ sort: 1 }" :remove="removeFile" class="upload-list-inline">
                  <a-button> <a-icon type="upload" /> 上传图片 </a-button>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="分析结果" prop="analysisresults" :labelCol="{ span: 6 }">
                <a-textarea v-model="form.analysisresults" placeholder="请输入分析结果" />
                <a-upload accept="image/jpg,image/jpeg,image/png" list-type="picture" :custom-request="uploadFile" :before-upload="beforeUpload2" :default-file-list="fileList2" :data="{ sort: 2 }" :remove="removeFile" class="upload-list-inline">
                  <a-button> <a-icon type="upload" /> 上传图片 </a-button>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="改善对策" prop="improvestrategy" :labelCol="{ span: 6 }">
                <a-textarea v-model="form.improvestrategy" placeholder="请输入改善对策" />
                <a-upload accept="image/jpg,image/jpeg,image/png" list-type="picture" :custom-request="uploadFile" :before-upload="beforeUpload3" :default-file-list="fileList3" :data="{ sort: 3 }" :remove="removeFile" class="upload-list-inline">
                  <a-button> <a-icon type="upload" /> 上传图片 </a-button>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="备注" prop="remark" :labelCol="{ span: 6 }">
                <a-textarea v-model="form.remark" placeholder="请输备注" />
               
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
import { setComplaint, setSopDocumnet, getComplaint } from "@/services/esop.js";
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
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fieldNames: { label: "Name", value: "Id", children: "Children" },
      form: {
        uploaddatetime: "",
        customername: "",
        businessuserid: "",
        businessuser: "",
        orderno: "",
        itemtype: "",
        itemcode: "",
        saledatetime: "",
        qty: 0,
        ngqty: 0,
        ngrate: "",
        ngdesc: "",
        analysisresults: "",
        departid: "",
        reportno: "",
        reportdatetime: "",
        improvestrategy: "",
        remark: "",
        files: [],
      },
      filesList: [],
      rules: {
        uploaddatetime: [
          {
            required: true,
            message: "请选择客诉日期",
            trigger: "change",
          },
        ],
        customername: [
          {
            required: true,
            message: "请输入客户名称",
            trigger: "blur",
          },
        ],
        businessuser: [
          {
            required: true,
            message: "请选择业务员",
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
        itemtype: [
          {
            required: true,
            message: "请输入产品型号",
            trigger: "blur",
          },
        ],
        itemcode: [
          {
            required: true,
            message: "请输入产品类别",
            trigger: "blur",
          },
        ],
        saledatetime: [
          {
            required: true,
            message: "请输入出货日期",
            trigger: "change",
          },
        ],
        qty: [
          {
            required: true,
            message: "请输入数量",
            trigger: "blur",
          },
        ],
        ngqty: [
          {
            required: true,
            message: "请输入不良数量",
            trigger: "blur",
          },
        ],
        reportdatetime: [
          {
            required: true,
            message: "请输入回复日期",
            trigger: "change",
          },
        ],
        reportno: [
          {
            required: true,
            message: "请输入回复单号",
            trigger: "blur",
          },
        ],
        ngdesc: [
          {
            required: true,
            message: "请输入不良描述",
            trigger: "blur",
          },
        ],
        analysisresults: [
          {
            required: true,
            message: "请输入分析结果",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur",
          },
        ],
        departid: [
          {
            required: true,
            message: "请选择责任部门",
            trigger: "blur",
          },
        ],
        improvestrategy: [
          {
            required: true,
            message: "请输入改善对策",
            trigger: "blur",
          },
        ],
      },
      spinning: false,
      department: [],
      isUserList: false,
      departName: [],
      BASE_URL_MOCK:""
    };
  },
  created() {
    this.getDepartmentList();
    if (this.isEdit) {
      this.form = lowerJSONKey(this.editData);
      this.fileList = this.form.files;
      if (process.env.NODE_ENV == "production") {
      //正式服
      this.BASE_URL_MOCK = window.location.origin;
    } else {
      //测试
      this.BASE_URL_MOCK ="http://192.168.1.245:8080";
    }
      this.$nextTick(() => {
        this.departName = [this.form.department];
        console.log("this.departName==",this.departName)
        this.form.files.forEach((item) => {
          let obj = {
            ...item,
            name: item.FileName,
            status: "done",
            url: this.BASE_URL_MOCK +item.FilePath,
            uid: item.Id,
          };
          if (item.Sort == 1) {
            this.fileList1.push(obj);
          }
          if (item.Sort == 2) {
            this.fileList2.push(obj);
          }
          if (item.Sort == 3) {
            this.fileList3.push(obj);
          }
          this.filesList.push({
            FileName: item.FileName,
            FilePath: item.FilePath,
            FilePrefix: item.FilePrefix,
            ResourceId: item.Id,
            sort: item.Sort,
            id: item.Id,
            uid: item.Id,
          });
        });
      });
    }
  },
  methods: {
    formattingDate(e, str) {
      console.log(e);
      this.form[str] = e.format("YYYY-MM-DD");
    },
    getDepartmentList() {
      getComplaint("", "getdepartment").then((res) => {
        if (res.data.success) {
          this.department = res.data.data;
          this.department.forEach((item, index) => {
            item.Id = item.Id + "_" + index;
          });
        }
      });
    },
    okUserModal(item) {
      this.isUserList = false;
      this.form.businessuserid = item.Id;
      this.form.businessuser = item.Name;
    },
    //不良率计算
    rateChange() {
      let rate = (this.form.ngqty / this.form.qty) * 100;
      console.log("rat======", rate);
      this.form.ngrate = rate.toFixed(2);
    },
    removeFile(record) {
      console.log("this.filesList===",this.filesList)
      let paramsData = this.filesList.find((item) => item.uid == record.uid);
      console.log("paramsData===", paramsData);
      let params = {
        resourceid: paramsData.ResourceId,
        filepath: paramsData.FilePath,
      };
      setSopDocumnet(params, "deletefile").then((res) => {
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
    beforeUpload1(file) {
      let fileList = [...this.fileList1, file];
      this.fileList1 = fileList.slice(-1);
      this.isImage(file);
    },
    beforeUpload2(file) {
      let fileList = [...this.fileList2, file];
      this.fileList2 = fileList.slice(-1);
      this.isImage(file);
    },
    beforeUpload3(file) {
      let fileList = [...this.fileList3, file];
      this.fileList3 = fileList.slice(-1);
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
              this.filesList.push({
                ...res.data.data,
                ...info.file,
                sort: info.data.sort,
              });
              console.log("1111", this.filesList);
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
          this.filesList.forEach((item) => {
            this.form.files.push({
              id: item.ResourceId,
              sort: item.sort,
            });
          });
          delete this.form.businessuser;
          if (this.isEdit) {
            this.form.id = this.editData.id;
            setComplaint(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("success");
                this.$emit("close");
                this.spinning = false;
              }
            });
          } else {
            setComplaint(this.form, "add").then((res) => {
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
