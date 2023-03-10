<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-12-30 13:49:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/financial/components/billForm.vue
-->

<template>
  <div>
    <a-drawer :visible="visible" :title="isEdit ? '编辑对账单' : '新增对账单'" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '10px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-card class="card" bordered :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="supplierCode" has-feedback label="客户名称" prop="supplierCode">
                <a-select show-search allowClear :show-arrow="false" :filter-option="false" :not-found-content="null" :disabled="isEdit" v-model="form.supplierCode" placeholder="请选择邀请企业" @search="getSupplier">
                  <a-select-option :value="item.Code" v-for="item in supplier" :key="item.Id">
                    {{ item.Name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="6">
              <a-form-model-item has-feedback label="对账单号" prop="orderNo"> <a-input :disabled="isEdit" v-model="form.orderNo" allowClear placeholder="请输入对账单号"/></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="采购类型" prop="orderNo"> <a-input :disabled="isEdit" v-model="form.purchasetype" allowClear placeholder="请输入对账单号"/></a-form-model-item
            ></a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="true" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item has-feedback label="税别" prop="isDeduct">
                <a-select v-model="form.taxpayeridnumber" has-feedback placeholder="请选择税别">
                  <a-select-option v-for="item in taxList" :key="item.value" :value="item.text">{{ item.text }}</a-select-option>
                </a-select></a-form-model-item
              >
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="bank" has-feedback label="开户行" prop="bank">
                <a-select v-model="form.bank" has-feedback placeholder="请选择开户行">
                  <a-select-option v-for="item in bankList" :key="item.value" :value="item.text">{{ item.text }}</a-select-option>
                </a-select></a-form-model-item
              >
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="bankCard" has-feedback label="银行账号"> <a-input v-model="form.bankCard" allowClear placeholder="请输入银行账号" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="expenseCycle" has-feedback label="对账周期" prop="expenseCycle"> <a-month-picker v-model="form.expenseCycle" :format="monthFormat" @change="expenseCycleChange" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="true" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="currency" has-feedback label="币种" prop="currency">
                <a-select v-model="form.currency" has-feedback placeholder="请选择币种">
                  <a-select-option v-for="(item, index) in currency" :key="index" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item  has-feedback label="采购员" prop="isDeduct">
                <a-select v-model="form.purchaseenterprise" has-feedback placeholder="请选择采购员">
                  <a-select-option v-for="item in taxList" :key="item.value" :value="item.text">{{ item.text }}</a-select-option>
                </a-select></a-form-model-item
              >
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="isInternal" has-feedback label="付款条件" prop="isInternal">
                <a-select v-model="form.bank" has-feedback placeholder="请选择税别">
                  <a-select-option v-for="item in taxList" :key="item.value" :value="item.text">{{ item.text }}</a-select-option>
                </a-select></a-form-model-item
              >
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="source" has-feedback label="仓库">
                <a-select style="width:200px" v-model="form.source" has-feedback placeholder="请选择币种">
                  <a-select-option v-for="item in paramsItem.SOURCE_DOCUMENTS" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="true" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="remark" has-feedback label="对账单备注"> <a-textarea v-model="form.remark" allowClear placeholder="备注" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form-model>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" :style="{ marginRight: '8px' }" :loading="loading" @click="handleOk('SAVE')">
          保存
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getSupplierAction, setExpense } from "@/services/srm.js";
import { getParamData } from "@/services/admin.js";
import moment from "moment";
import { bankList } from "../data/bank";
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      bankList,
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      taxList: [],
      form: {
        orderno: "",
        purchaseenterprise: "",
        type: "",
        purchasetype: "",
        suppliercode: "",
        supplierfullname: "",
        taxpayeridnumber: "",
        billcyclestart: "",
        billcycleend: "",
        currency: "",
        billmoneytax: "",
        billmoney: "",
        billtax: "",
        billconfirmmoneytax: "",
        billconfirmmoney: "",
        billconfirmtax: "",
      },
      rules: {
        supplierCode: [
          {
            required: true,
            message: "请选择供应商",
            trigger: "change",
          },
        ],
        orderNo: [
          {
            required: true,
            message: "请输入费用单号",
            trigger: "change",
          },
        ],
        currency: [
          {
            required: true,
            message: "请选择币种",
            trigger: "change",
          },
        ],
        rate: [
          {
            required: true,
            message: "请选择税率",
            trigger: "change",
          },
        ],
        expenseCycle: [
          {
            required: true,
            message: "请选择费用周期",
            trigger: "change",
          },
        ],
      },
      departmentalList: [],
      isUser: false,
      user: [],
      dynamicValidateForm: [],
      addUserIndex: -1,
      rawData: [],
      userList: [],
      userType: "",
      loading: false,
      supplier: [],
      currency: ["美元", "越南盾", "人民币", "日元", "港币", "英镑", "欧元", "澳元"],
      taxRateList: [],
      paramsList: ["TAX_RATE", "SOURCE_DOCUMENTS"],
      paramsItem: [],
      monthFormat: "YYYY-MM",
      count: 2,
    };
  },
  created() {
    this.getSupplier();
    this.getParamData();
    if (this.isEdit) {
      console.log(this.editData);
      let { order, detailList } = this.editData;
      this.dataSource = detailList;
      this.form = {
        id: order.Id,
        orderNo: order.OrderNo,
        enterpriseId: "",
        supplierCode: order.SupplierCode,
        bank: order.Bank,
        bankCard: order.BankCard,
        taxpayerIdNumber: order.TaxpayerIdNumber,
        currency: order.Currency,
        rate: order.Rate,
        isDeduct: order.IsDeduct,
        isInternal: order.IsInternal,
        source: order.Source,
        expenseCycle: order.ExpenseCycle,
        remark: order.Remark,
        children: [],
      };
    }
  },
  methods: {
    moment,
    rateChange(e) {
      this.form.rate = e;
    },
    expenseCycleChange(e, string) {
      console.log(e);
      console.log(string);
      this.form.expenseCycle = string;
    },
    getParamData() {
      this.paramsList.forEach((item) => {
        let params = {
          groupcode: item,
        };
        getParamData(params).then((res) => {
          if (res.data.success) {
            this.paramsItem[item] = res.data.data;
          }
          console.log(this.paramsItem.PLC_PARAMS_TYPE);
        });
      });
    },
    getSupplier(value) {
      let params = {
        pageindex: 1,
        pagesize: 100,
        keyword: value,
      };
      getSupplierAction(params, "getsupplier").then((res) => {
        if (res.data.success) {
          this.supplier = res.data.data.list;
        }
      });
    },
    handleAdd() {
      const { count, dataSource } = this;
      this.count = count + 1;
      const newData = {
        ExpenseTitle: "",
        ExpenseType: "",
        ExpenseReason: "",
        ExpenseClass: "",
        ExpenseMoney: "",
        ExpenseDate: "",
        Cost: "",
        Internal: "",
        Remark: "",
        key: count,
      };
      this.dataSource = [...dataSource, newData];
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter((item) => item.key !== key);
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.loading = true;
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          console.log("dataSource===", this.dataSource);
          this.form.children = [];
          this.dataSource.forEach((item) => {
            this.form.children.push({
              expenseTitle: item.ExpenseTitle,
              expenseType: item.ExpenseType,
              expenseReason: item.ExpenseReason,
              expenseClass: item.ExpenseClass,
              expenseMoney: item.ExpenseMoney,
              expenseDate: item.ExpenseDate,
              cost: item.Cost,
              internal: item.Internal,
              remark: item.Remark,
            });
          });
          if (this.isEdit) {
            setExpense(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
              this.loading = false;
            });
          } else {
            setExpense(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
              this.loading = false;
            });
          }
        } else {
          this.loading = false;
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
/deep/ .ant-card-head-title {
  padding: 0px 0;
}
/deep/ .ant-card-head {
  min-height: 0;
}
</style>
