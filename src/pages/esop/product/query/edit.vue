<!--
 * @Author: max
 * @Date: 2022-04-06 16:12:29
 * @LastEditTime: 2022-04-07 11:17:50
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
            <a-form-model-item label="产品大类" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProType" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']" @deselect="delProType" @select="addProType">
                <a-select-option v-for="(item, index) in form.ProType" :key="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品系列" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProTypeDetail" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']" @deselect="delProTypeDetail" @select="addProTypeDetail">
                <a-select-option v-for="(item, index) in form.ProTypeDetail" :key="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="品名" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProName" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']" @deselect="delProName" @select="addProName">
                <a-select-option v-for="(item, index) in form.ProName" :key="index">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="品号" :labelCol="{ span: 6 }">
              <a-select v-model="form.ProCode" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']" @deselect="delProCode" @select="addProCode">
                <a-select-option v-for="(item, index) in form.ProCode" :key="index">
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
      ProTypeDCodeList: [],
      ProCodeList: [],
      ProTypeCodeList: [],
      ProNameList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //大类
    delProType(value) {
      console.log(this.ProTypeCodeList);
      this.ProTypeCodeList.forEach((item, index) => {
        if (value == item.Value) {
          if (item.Id != "") {
            item.IsDel = "Y";
          } else {
            this.ProTypeCodeList.splice(index, 1);
          }
        }
      });
    },
    addProType(value) {
      console.log("111删除");
      this.ProTypeCodeList.push({
        Id: "",
        Value: value,
        IsDel: "",
      });
    },
    //系列
    delProTypeDetail(value) {
      this.ProTypeDCodeList.map((item, index) => {
        if (value == item.Value) {
          if (item.Id != "") {
            item.IsDel = "Y";
          } else {
            this.ProTypeDCodeList.splice(index, 1);
          }
        }
      });
    },
    addProTypeDetail(value) {
      this.ProTypeDCodeList.push({
        Id: "",
        Value: value,
        IsDel: "",
      });
    },
    //品名
    delProName(value) {
      this.ProNameList.map((item, index) => {
        if (value == item.Value) {
          if (item.Id != "") {
            item.IsDel = "Y";
          } else {
            this.ProNameList.splice(index, 1);
          }
        }
      });
    },
    addProName(value) {
      this.ProNameList.push({
        Id: "",
        Value: value,
        IsDel: "",
      });
    },
    //品号
    delProCode(value) {
      this.ProCodeList.map((item, index) => {
        if (value == item.Value) {
          if (item.Id != "") {
            item.IsDel = "Y";
          } else {
            this.ProCodeList.splice(index, 1);
          }
        }
      });
    },
    addProCode(value) {
      this.ProCodeList.push({
        Id: "",
        Value: value,
        IsDel: "",
      });
    },
    getList() {
      let params = {
        documentid: this.editData.Id, //文件ID
      };
      getProduct(params, "getproductdetail").then((res) => {
        if (res.data.success) {
          let list = res.data.data;
          this.ProTypeDCodeList = list.ProTypeDCodeList;
          this.ProCodeList = list.ProCodeList;
          this.ProTypeCodeList = list.ProTypeCodeList;
          this.ProNameList = list.ProNameList;
          this.ProTypeDCodeList.forEach((item) => {
            this.form.ProTypeDetail.push(item.Value);
          });
          this.ProTypeCodeList.forEach((item) => {
            this.form.ProType.push(item.Value);
          });
          this.ProCodeList.forEach((item) => {
            this.form.ProCode.push(item.Value);
          });
          this.ProNameList.forEach((item) => {
            this.form.ProName.push(item.Value);
          });
          // console.log(this.form);
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            PlantId: this.plantId, //工厂ID
            DocumentId: this.editData.Id, //文件ID
            ProTypeCodeList: this.ProTypeCodeList,
            ProTypeDCodeList: this.ProTypeDCodeList,
            ProCodeList: this.ProCodeList,
            ProNameList: this.ProNameList,
          };
          console.log("params===", params);
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
