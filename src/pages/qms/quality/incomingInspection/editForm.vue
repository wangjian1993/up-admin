<!--
 * @Author: max
 * @Date: 2022-05-05 11:32:20
 * @LastEditTime: 2023-07-13 16:21:59
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/quality/incomingInspection/editForm.vue
-->
<template>
  <div>
    <a-modal title="编辑来料检测" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="业务公司">
          {{ form.CompanyName }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="PO号">
          {{ form.PuchaseOrderNo }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="供应商">
          {{ form.SupplierFullName }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="品号">
          {{ form.ItemCode }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="品名">
          {{ form.ItemDescription }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="规格">
          {{ form.ItemSpecification }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="来料数量">
          {{ form.Qty }}
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试开始时间" prop="TestItem">
          <a-date-picker format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" show-time v-model="form.DatetimeTestStart" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试结束时间" prop="TestItem">
          <a-date-picker format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss" show-time v-model="form.DatetimeTestEnd" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试图片" prop="TestItem">
          <a-upload accept="image/jpg,image/jpeg,image/png" :custom-request="uploadImg" :before-upload="beforeUpload" :file-list="FileList" :remove="removeFile" class="upload-list-inline">
            <a-button> <a-icon type="upload" /> 上传图片 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试项目" prop="TestItem">
          <a-select v-model="form.TestItem" :disabled="isEdit" placeholder="请选择测试项目">
            <a-select-option v-for="item in testItemList" :key="item.TestItem" :value="item.TestItem">{{ item.TestItemName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试项目" prop="TestItem">
          <a-select v-model="form.TestItem" :disabled="isEdit" placeholder="请选择测试项目">
            <a-select-option v-for="item in testItemList" :key="item.TestItem" :value="item.TestItem">{{ item.TestItemName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="测试结果" prop="TestResult">
          <a-select v-model="form.TestResult" :disabled="isEdit" placeholder="请选择测试结果">
            <a-select-option v-for="item in paramsItem.IQC_INCOMING_TEST_ITEM_RESULT" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="备注" prop="Remarks">
          <a-textarea v-model="form.Remarks" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setIncomingTest } from "@/services/qms.js";
import { uploadFile } from "@/services/admin.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: ["editData", "isEdit", "paramsItem", "testItemList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        CompanyName: "",
        DocNo: "",
        ItemCode: "",
        ItemDescription: "",
        ItemSpecification: "",
        PuchaseOrderNo: "",
        Qty: "",
        SupplierCode: "",
        SupplierFullName: "",
        Unit: "",
        TestItem: "",
        TestResult: "",
        id: "",
        Remarks: "",
        DatetimeTestStart: "",
        DatetimeTestEnd: "",
      },
      FileList: [],
    };
  },
  created() {
    this.form = { ...this.editData };
    this.editData.TestImgList.forEach((img) => {
      this.FileList.push({
        uid: img.ImgId,
        name: img.ImgId,
        status: "done",
        url: img.ImgUrl,
      });
    });
  },
  methods: {
    removeFile(file) {
      this.FileList.forEach((item, index) => {
        if (item.uid == file.uid) {
          this.FileList.splice(index, 1);
        }
      });
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("请选择jpg或者png格式图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片太大了.请上传小于2M图片");
      }
      return isJpgOrPng && isLt2M;
    },
    uploadImg(info) {
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl;
        let typeArray = info.file.type.split("/");
        let fileType = typeArray[1].toUpperCase();
        let params = {
          FileName: info.file.name,
          FileContent: imageUrl,
          FileSuffix: "." + fileType,
        };
        uploadFile(params).then((res) => {
          if (res.data.success) {
            this.$message.success("上传成功!");
            this.FileList.push({
              uid: res.data.data.ResourceId,
              name: res.data.data.FileName,
              status: "done",
              url: res.data.data.ImgUrl,
            });
          } else {
            this.$message.error(`上传失败`);
          }
        });
        // this.loading = false;
      });
    },
    close() {
      this.$emit("closeModal");
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let imgList = [];
          this.FileList.forEach((img) => {
            imgList.push(img.uid);
          });
          let editForm = {
            Id: this.form.id,
            TestItem: this.form.TestItem,
            TestResult: this.form.TestResult,
            Remarks: this.form.Remarks || "",
            DatetimeTestStart: this.form.DatetimeTestStart,
            DatetimeTestEnd: this.form.DatetimeTestEnd,
            TestImgIds: imgList.join(","),
          };
          setIncomingTest(editForm, "multiple/update").then((res) => {
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
