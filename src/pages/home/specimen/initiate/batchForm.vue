<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-08-11 16:49:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/initiate/batchForm.vue
-->

<template>
  <div>
    <a-modal title="批量填表" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="60%">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" @click="handleOk('SAVE')">
          保存
        </a-button>
        <a-button type="primary" @click="handleOk('SAVEANDSUBMIT')">
          提交下一节点
        </a-button>
      </template>
      <a-form-model ref="ruleForm" layout="inline" :model="form" :rules="rules">
        <a-row>
          <a-col :span="8">
            <a-form-model-item has-feedback label="公司名称">
              <span>{{ editData.EnterpriseName }}</span>
            </a-form-model-item></a-col
          >
          <a-col :span="8">
            <a-form-model-item has-feedback label="发起部门">
              <span>{{ editData.DepartmentName }}</span>
            </a-form-model-item></a-col
          >
          <a-col :span="8">
            <a-form-model-item has-feedback label="条件">
              <span>{{ editData.Condition }}</span>
            </a-form-model-item></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item ref="Supplier" has-feedback label="供应商" prop="Supplier">
              <!-- <a-input v-model="form.Supplier"  allowClear placeholder="请输入供应商" /> -->
              <a-select style="width: 200px;" show-search v-model="form.Supplier" placeholder="请输入供应商" :default-active-first-option="false" :show-arrow="false" :filter-option="false" :not-found-content="null" @search="handleSearch" @change="(e) => changeSearch(e, index)">
                <a-select-option v-for="item in supplierList" :value="item.SupplierName" :key="item.RowNumber">
                  {{ item.SupplierName }}
                </a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="6">
              <a-form-model-item ref="SupplierCode" has-feedback label="供应商编码" prop="SupplierCode"> <a-input v-model="form.SupplierCode" disabled allowClear placeholder="请输入供应商编码" /> </a-form-model-item
            ></a-col>
          <a-col :span="8">
            <a-form-model-item ref="DatetimePurchaseDeliver" has-feedback label="采购送样日期" prop="DatetimePurchaseDeliver"> <a-date-picker @change="(e) => DatetimeChange1(e, index)" v-model="form.DatetimePurchaseDeliver" show-time type="date" placeholder="选择采购送样日期" style="width: 100%;" /> </a-form-model-item
          ></a-col>
          <a-col :span="8">
            <a-form-model-item ref="Purchaser" has-feedback label="送样采购员" prop="Purchaser"> <a-input v-model="form.Purchaser" allowClear placeholder="请输入送样采购员" /> </a-form-model-item
          ></a-col>
        </a-row>
      </a-form-model>
      <a-card v-for="(formItem, index) in dynamicValidateForm" :key="index" class="card" :bordered="true" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
        <a-form-model ref="ruleForm1" layout="inline" :model="formItem">
          <a-row>
            <a-col :span="12"
              ><span>{{ index + 1 }}</span></a-col
            >
            <a-col :span="12"> <a-icon class="dynamic-delete-button" v-if="!index == 0" type="minus-circle-o" @click="removeDomain(formItem)"/></a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item ref="ItemCode" has-feedback label="物料编码" prop="ItemCode"><a-input-search placeholder="请输入物料编码" style="width: 220px" v-model="formItem.ItemCode" @search="(e) => onSearch(e, index)"/></a-form-model-item
            ></a-col>
            <a-col :span="8">
              <a-form-model-item ref="ItemName" has-feedback label="物料名称" prop="ItemName"
                ><a-textarea v-model="formItem.ItemName" disabled allowClear placeholder="请输物料名称" /></a-form-model-item
              ></a-col
            >
            <a-col :span="8">
              <a-form-model-item ref="ItemSpecification" has-feedback label="物料型号" prop="ItemSpecification"
                ><a-textarea :rows="4" v-model="formItem.ItemSpecification" disabled allowClear placeholder="请输入物料型号" /></a-form-model-item
              ></a-col
            >
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item ref="DrawingNo" has-feedback label="图号"> <a-input v-model="formItem.DrawingNo" allowClear placeholder="请输入图号" /> </a-form-model-item
            ></a-col>
            <a-col :span="8">
              <a-form-model-item ref="HasApprovalSheet" has-feedback label="是否有承认书" prop="HasApprovalSheet">
                <a-select style="width: 100px;" v-model="formItem.HasApprovalSheet" has-feedback placeholder="请选择是否有承认书">
                  <a-select-option value="是">是</a-select-option>
                  <a-select-option value="否">否</a-select-option>
                </a-select></a-form-model-item
              >
            </a-col>
            <a-col :span="8">
              <a-form-model-item ref="Quantity" has-feedback label="数量" prop="Quantity"> <a-input v-model="formItem.Quantity" allowClear placeholder="请输入数量" /> </a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item has-feedback label="采购取回样品日期" prop="DatetimePurchaseRetrieve"> <a-date-picker @change="(e) => DatetimeChange(e, index)" v-model="formItem.DatetimePurchaseRetrieve" show-time type="date" placeholder="选择采购取回样品日期" style="width: 100%;" /> </a-form-model-item
            ></a-col>
            <a-col :span="8">
              <a-form-model-item has-feedback label="样品类别" prop="SampleCategory"> <a-input v-model="formItem.SampleCategory" allowClear placeholder="请输入样品类别" /> </a-form-model-item
            ></a-col>
            <a-col :span="8">
              <a-form-model-item has-feedback label="受控公司" prop="CtrledCompany"> <a-input v-model="formItem.CtrledCompany" allowClear placeholder="请输入受控公司" /> </a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item ref="Remark1" has-feedback label="采购备注" prop="Remark1"> <a-input v-model="formItem.Remark1" allowClear placeholder="请输入采购备注" /> </a-form-model-item
            ></a-col>
          </a-row>
        </a-form-model>
      </a-card>
      <div class="add-btn">
        <a-button type="primary" style="width:300px;margin:0 auto;" @click="addForm"> <a-icon type="plus" />添加</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getMaterialSampleApi, setDepartmentApi } from "@/services/web.js";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  props: ["editData"],
  data() {
    return {
      size: "small",
      visible: true,
      form: {
        Supplier: "",
        DatetimePurchaseDeliver: "",
        Purchaser: "",
        SupplierCode:"",
      },
      rules: {
        Supplier: [
          {
            required: true,
            message: "请输入供应商",
            trigger: "blur",
          },
        ],
      },
      supplierList: [],
      dynamicValidateForm: [
        {
          ItemCode: "", //物料编码
          ItemName: "", //物料名称
          ItemSpecification: "", //物料型号
          DrawingNo: "", //图号
          HasApprovalSheet: "", //是否有承认书
          Quantity: "", //数量
          DatetimePurchaseRetrieve: "", //采购取回样品日期
          SampleCategory: "", //样品类别
          CtrledCompany: "", //受控公司
          Remark1: "", //采购备注
        },
      ],
    };
  },
   computed: {
    ...mapGetters("account", ["user"]),
  },
  created() {
    this.form.DatetimePurchaseDeliver = moment().format("YYYY-MM-DD HH:mm:ss");
    this.form.Purchaser = this.user;
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    //添加
    addForm() {
      this.dynamicValidateForm.push({
        ItemCode: "", //物料编码
        ItemName: "", //物料名称
        ItemSpecification: "", //物料型号
        DrawingNo: "", //图号
        HasApprovalSheet: "", //是否有承认书
        Quantity: "", //数量
        DatetimePurchaseRetrieve: "", //采购取回样品日期
        SampleCategory: "", //样品类别
        CtrledCompany: "", //受控公司
        Remark1: "", //采购备注
      });
    },
    removeDomain(item) {
      console.log(item);
      let index = this.dynamicValidateForm.indexOf(item);
      console.log(this.rawData);
      if (index !== -1) {
        this.dynamicValidateForm.splice(index, 1);
      }
    },
    DatetimeChange1(e) {
      this.form.DatetimePurchaseDeliver = e.format("YYYY-MM-DD HH:mm:ss");
    },
    DatetimeChange(e, index) {
      this.dynamicValidateForm[index].DatetimePurchaseRetrieve = e.format("YYYY-MM-DD HH:mm:ss");
    },
    changeSearch(e) {
      this.supplierList.forEach((item) => {
        if (item.SupplierName == e) {
          this.form.SupplierCode = item.SupplierCode;
        }
      });
    },
    handleSearch(value) {
      let params = {
        pageindex: 1,
        pagesize: 50,
        keyword: value,
      };
      getMaterialSampleApi(params, "getsupplierlist").then((res) => {
        if (res.data.data.list) {
          this.supplierList = res.data.data.list;
        }
      });
    },
    onSearch(e, index) {
      let params = {
        itemcode: e,
        usercode: localStorage.getItem("account"),
      };
      getMaterialSampleApi(params, "getitemmoreinfo").then((res) => {
        if (res.data.success) {
          console.log(index);
          this.dynamicValidateForm[index].ItemName = res.data.data[0].ItemName;
          this.dynamicValidateForm[index].ItemSpecification = res.data.data[0].ItemSpecification;
          this.dynamicValidateForm[index].DrawingNo = res.data.data[0].DrawingNo;
          this.getItemCount(e);
        }
      });
    },
    getItemCount(e) {
      let params1 = {
        itemcode: e,
      };
      getMaterialSampleApi(params1, "getitemngtimes").then((res) => {
        console.log("res.data.data.NgTimes===", res.data.data.NgTimes);
        if (res.data.success && res.data.data.NgTimes > 2) {
          this.$message.warning("该物料编码作废过2次");
        }
      });
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk(type) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log("form===", this.form);
          console.log("departmentalList===", this.dynamicValidateForm);
          let isFlag = true;
          this.dynamicValidateForm.forEach((item, index) => {
            if (item.ItemCode == "") {
              this.$message.warning("第" + (index + 1) + "行,物料编码为空,");
              isFlag = false;
            }
          });
          if (!isFlag) {
            return;
          }
          let params = {
            SubmitSign: type, //提交标识：1,，SAVE-保存 2，SAVEANDSUBMIT-保存并提交到下一节点
            FlowId: this.editData.FlowId, //流程ID
            Supplier: this.form.Supplier, //供应商
            SupplierCode:this.form.SupplierCode,
            DatetimePurchaseDeliver: this.form.DatetimePurchaseDeliver != "" ? this.form.DatetimePurchaseDeliver : "",
            Purchaser: this.form.Purchaser,
            Item: this.dynamicValidateForm,
          };
          setDepartmentApi(params, "addregistermulti").then((res) => {
            if (res.data.success) {
              this.$message.success("发起成功!");
              this.$emit("closeModal");
              this.$emit("success");
              this.visible = false;
              //   this.$store.dispatch("specimen/registerIdActions", res.data.data.RegisterId);
              //   this.$router.push({ path: "/specimen/backlog" });
              // console.log("dispatch", this.$store.dispatch('specimen/registerIdActions'))
              this.$router.push({ name: "待办事宜" });
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
.add-btn {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.dynamic-delete-button {
  display: flex;
  justify-content: flex-end;
}
/deep/.ant-modal-content {
  overflow: auto;
}
/deep/ .ant-modal-body {
  height: 600px;
  overflow: auto;
}
</style>
