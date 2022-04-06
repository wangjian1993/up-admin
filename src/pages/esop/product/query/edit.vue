<!--
 * @Author: max
 * @Date: 2022-04-06 16:12:29
 * @LastEditTime: 2022-04-06 17:46:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/product/query/edit.vue
-->
<template>
  <div>
    <a-modal title="编辑" :visible="visible" v-if="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="840">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="产品大类" prop="ProType" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProType" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']">
                <a-select-option v-for="(item, index) in ProType" :key="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品系列" prop="ProTypeDetail" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProTypeDetail" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']">
                <a-select-option v-for="(item, index) in ProTypeDetail" :key="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="品名" prop="ProName" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProName" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']">
                <a-select-option v-for="(item, index) in ProName" :key="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="品号" prop="ProCode" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProCode" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']">
                <a-select-option v-for="(item, index) in ProCode" :key="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setProduct, getProduct } from "@/services/esop.js";
export default {
  props: ["editData", "plantId"],
  data() {
    return {
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        ProTypeDetail: [],
        ProType: [],
        ProCode: [],
        ProName: [],
      },
      rules: {
        ProTypeDetail: [
          {
            required: true,
            message: "请输入文件编码",
            trigger: "blur",
          },
        ],
        ProType: [
          {
            required: true,
            message: "请输入文件名称",
            trigger: "blur",
          },
        ],
        ProCode: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        ProName: [
          {
            required: true,
            message: "请输入版本号",
            trigger: "blur",
          },
        ],
      },
      sortValue: 1,
    };
  },
  created() {
    this.getList();
    // this.form.ProTypeDetail = this.editData.ProTypeDCode.split(",");
    // this.form.ProType = this.editData.ProTypeCode.split(",");
    // this.form.ProCode = this.editData.ProCode.split(",");
    // this.form.ProName = this.editData.ProName.split(",");
  },
  methods: {
    getList() {
      let params = {
        documentid: this.editData.Id, //文件ID
      };
      getProduct(params, "getproductdetail").then((res) => {
        if (res.data.success) {
            console.log("res===",res)
          // this.$message.success("添加成功!");
          // this.$emit("success");
          // this.$emit("close");
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            PlantId: this.plantId, //工厂ID
            DocumentId: this.editData.Id, //文件ID
            ProTypeCodeList: [],
            ProTypeDCodeList: [],
            ProCodeList: [],
            ProNameList: [],
          };
          this.form.ProTypeDetail.forEach((item) => {
            params.ProTypeDCodeList.push({
              Id: "", //默认""
              Value: item, //大类名称
              IsDel: "", //默认""
            });
          });
          this.form.ProType.forEach((item) => {
            params.ProTypeCodeList.push({
              Id: "", //默认""
              Value: item, //大类名称
              IsDel: "", //默认""
            });
          });
          this.form.ProCode.forEach((item) => {
            params.ProCodeList.push({
              Id: "", //默认""
              Value: item, //大类名称
              IsDel: "", //默认""
            });
          });
          this.form.ProName.forEach((item) => {
            params.ProNameList.push({
              Id: "", //默认""
              Value: item, //大类名称
              IsDel: "", //默认""
            });
          });
          setProduct(params, "addorupdate").then((res) => {
            if (res.data.success) {
              this.$message.success("添加成功!");
              this.$emit("success");
              this.$emit("close");
            }
          });
        }
      });
    },
    handleCancel() {
      this.$emit("close");
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
