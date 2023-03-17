<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-03-17 16:12:45
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/goods/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑地址' : '添加地址'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="60%">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="companyid" has-feedback label="招待公司" prop="companyid">
              <a-select v-model="form.companyid" :disabled="isEdit" has-feedback placeholder="请选择设公司名称" @change="companyChange">
                <a-select-option v-for="item in enterList" :key="item.Id" :value="item.Id">{{ item.CompanyName }}</a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐品分类" prop="classifyid">
              <a-select v-model="form.classifyid" :disabled="isEdit" has-feedback placeholder="请选择设公司名称">
                <a-select-option v-for="item in classifyList" :key="item.Id" :value="item.Id">{{ item.ClassifyName }}</a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="addressids" has-feedback label="招待地点" prop="addressids">
              <a-select v-model="form.addressids" mode="multiple" :disabled="isEdit" has-feedback placeholder="请选择设招待地点">
                <a-select-option v-for="item in addressList" :key="item.Id" :value="item.Id">{{ item.Place }}</a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐品编码" prop="goodscode"> <a-input v-model="form.goodscode" :disabled="isEdit" has-feedback placeholder="请输入餐品编码"></a-input> </a-form-model-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item has-feedback label="现货">
              <a-radio-group :value="form.isspotgoods" button-style="solid" @change="enableChange">
                <a-radio-button value="N">否</a-radio-button>
                <a-radio-button value="Y">是</a-radio-button>
              </a-radio-group>
            </a-form-model-item></a-col
          >
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐盘名称" prop="goodsname"> <a-input v-model="form.goodsname" has-feedback placeholder="请输入餐品编码"></a-input> </a-form-model-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐盘单价"> <a-input-number :min="0" v-model="form.price" has-feedback placeholder="请输入餐盘单价"></a-input-number> </a-form-model-item
          ></a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐品单位"> <a-input v-model="form.unit" has-feedback placeholder="请输入餐品单位"></a-input> </a-form-model-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item has-feedback label="排序"> <a-input-number :min="0" v-model="form.sort" has-feedback placeholder="请输入排序"></a-input-number> </a-form-model-item
          ></a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐盘库存" prop="qty"> <a-input-number :min="0" v-model="form.qty" has-feedback placeholder="请输入餐盘库存"></a-input-number> </a-form-model-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐盘图片" prop="type">
              <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :custom-request="uploadImg" accept="image/png, image/jpeg">
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="head" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-form-model-item></a-col
          >
          <a-col :span="12">
            <a-form-model-item ref="status" has-feedback label="状态" prop="status">
              <a-select v-model="form.status" has-feedback placeholder="请选择设公司名称">
                <a-select-option value="上架">上架</a-select-option>
                <a-select-option value="下架">下架</a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item has-feedback label="餐品说明"> <a-textarea v-model="form.goodsdesc" placeholder="请输入餐品说明" :auto-size="{ minRows: 3, maxRows: 5 }" /> </a-form-model-item
          ></a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setGoods, getGoodsClassify, getOrderAddress } from "@/services/ors.js";
import { uploadFile } from "@/services/admin.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: ["editData", "isEdit", "enterList", "paramsItem"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        classifyid: "",
        goodscode: "",
        goodsname: "",
        pictureid: "", // 图片ID
        isrecommend: true, // 是否推荐
        unit: "",
        qty: 0,
        price: 0,
        sort: 1,
        status: "",
        isspotgoods: "Y", // 是否现货
        goodsdesc: "", // 餐品说明
        addressids: [],
      },
      rules: {
        classifyid: [
          {
            required: true,
            message: "请选择分类",
            trigger: "blur",
          },
        ],
        goodscode: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur",
          },
        ],
        goodsname: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        addressids: [
          {
            required: true,
            message: "请选择地点",
            trigger: "blur",
          },
        ],
        qty: [
          {
            required: true,
            message: "请输入库存",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur",
          },
        ],
      },
      classifyList: [],
      addressList: [],
      imageUrl: "",
      fileData: [],
      loading: false,
    };
  },
  created() {
    this.getGoodsClass();
    if (this.isEdit) {
      this.form.addressids = [];
      this.form.classifyid = this.editData.ClassifyId;
      this.form.companyid = this.editData.CompanyId;
      this.form.goodscode = this.editData.GoodsCode;
      this.form.goodsname = this.editData.GoodsName;
      this.form.pictureid = this.editData.PictureId;
      this.form.isrecommend = this.editData.IsSpotGoods;
      this.form.unit = this.editData.Unit;
      this.form.qty = this.editData.Qty;
      this.form.price = this.editData.Price;
      this.form.sort = this.editData.Sort;
      this.form.status = this.editData.Status;
      this.form.isspotgoods = this.editData.IsSpotGoods ? "Y" : "N"; // 是否现货
      this.form.goodsdesc = this.editData.GoodsDesc;
      this.form.imageUrl = "./" + this.editData.PictureUrl;
      this.editData.Addresss.forEach((item) => {
        this.form.addressids.push(item.Id);
      });
      this.companyChange(this.form.companyid);
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
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
        console.log(info.file);
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
            this.fileData = res.data.data;
          } else {
            this.$message.error(`上传失败`);
          }
        });
        this.loading = false;
      });
    },
    companyChange(e) {
      let params = {
        pageindex: 1,
        pagesize: 100,
        companyid: e,
      };
      getOrderAddress(params, "get").then((res) => {
        if (res.data.success) {
          this.addressList = res.data.data.list;
        }
      });
    },
    getGoodsClass() {
      let params = {
        pageindex: 1,
        pagesize: 100,
      };
      getGoodsClassify(params, "get").then((res) => {
        if (res.data.success) {
          this.classifyList = res.data.data.list;
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.isspotgoods = this.form.isspotgoods === "Y" ? true : false;
            let editForm = {
              id: this.editData.Id, //部门ID
              ...this.form,
            };
            setGoods(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            console.log(this.form);
            this.form.pictureid = this.fileData.ResourceId;
            this.form.isspotgoods = this.form.enable === "Y" ? true : false;
            setGoods(this.form, "add").then((res) => {
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
.head {
  width: 200px;
  height: 200px;
}
</style>
