<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-12-13 09:26:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/financial/component/addExpense.vue
-->

<template>
  <div>
    <a-drawer :visible="visible" title="新增费用单" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '10px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-card class="card" bordered :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="supplierCode" has-feedback label="供应商名称" prop="supplierCode">
                <a-select show-search allowClear :show-arrow="false" :filter-option="false" :not-found-content="null" :disabled="isEdit"  v-model="form.supplierCode" placeholder="请选择邀请企业" @search="getSupplier">
                  <a-select-option :value="item.Code" v-for="item in supplier" :key="item.Id">
                    {{ item.Name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="6">
              <a-form-model-item has-feedback label="费用单号" prop="orderNo"> <a-input :disabled="isEdit" v-model="form.orderNo" allowClear placeholder="请输入费用单号"/></a-form-model-item
            ></a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="true" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
          <a-row>
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
              <a-form-model-item ref="taxpayerIdNumber" has-feedback label="纳税人识别号"> <a-input v-model="form.taxpayerIdNumber" allowClear placeholder="请输入纳税人识别号" /> </a-form-model-item>
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
              <a-form-model-item ref="rate" has-feedback label="税率" prop="rate">
                <a-select style="width:120px" has-feedback placeholder="请选择币种" @change="rateChange">
                  <a-select-option v-for="item in paramsItem.TAX_RATE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select>
                <span style="padding:0 5px;">含税</span>
                <a-input disabled v-model="form.rate" style="width:80px" suffix="%" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="isDeduct" has-feedback label="抵扣发票" prop="isDeduct">
                <a-radio-group v-model="form.isDeduct">
                  <a-radio value="true">
                    是
                  </a-radio>
                  <a-radio value="false">
                    否
                  </a-radio>
                </a-radio-group></a-form-model-item
              >
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="isInternal" has-feedback label="是否内部" prop="isInternal">
                <a-radio-group v-model="form.isInternal">
                  <a-radio value="true">
                    是
                  </a-radio>
                  <a-radio value="false">
                    否
                  </a-radio>
                </a-radio-group></a-form-model-item
              >
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="source" has-feedback label="单据来源">
                <a-select style="width:200px" v-model="form.source" has-feedback placeholder="请选择币种">
                  <a-select-option v-for="item in paramsItem.SOURCE_DOCUMENTS" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="expenseCycle" has-feedback label="费用周期" prop="expenseCycle"> <a-month-picker v-model="form.expenseCycle" :format="monthFormat" @change="expenseCycleChange" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="true" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="remark" has-feedback label="备注"> <a-textarea v-model="form.remark" allowClear placeholder="备注" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form-model>
      <a-button class="editable-add-btn" type="primary" @click="handleAdd">
        添加
      </a-button>
      <a-table bordered size="small" :data-source="dataSource" :pagination="false" :columns="columns">
        <template slot="ExpenseTitle" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.ExpenseTitle" size="small" />
          </div>
        </template>
        <template slot="ExpenseType" slot-scope="text, record">
          <div>
            <a-select style="width:80px" size="small" v-model="record.ExpenseType" has-feedback>
              <a-select-option value="扣款">扣款</a-select-option>
              <a-select-option value="补款">补款</a-select-option>
            </a-select>
          </div>
        </template>
        <template slot="ExpenseReason" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.ExpenseReason" size="small" />
          </div>
        </template>
        <template slot="ExpenseClass" slot-scope="text, record">
          <div>
            <a-select style="width:80px" size="small" v-model="record.ExpenseClass" has-feedback>
              <a-select-option value="扣款">扣款</a-select-option>
              <a-select-option value="补款">补款</a-select-option>
            </a-select>
          </div>
        </template>
        <template slot="ExpenseMoney" slot-scope="text, record">
          <div>
            <a-input-number :min="0" style="width:80px" v-model="record.ExpenseMoney" size="small" />
          </div>
        </template>
        <template slot="ExpenseDate" slot-scope="text, record">
          <div>
            <a-date-picker style="width:150px" v-model="record.ExpenseDate" size="small" />
          </div>
        </template>
        <template slot="Cost" slot-scope="text, record">
          <div>
            <a-select style="width:80px" size="small" v-model="record.Cost" has-feedback> </a-select>
          </div>
        </template>
        <template slot="Internal" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.Internal" size="small" />
          </div>
        </template>
        <template slot="Remark" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.Remark" size="small" />
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-popconfirm v-if="dataSource.length" title="确定要删除行?" @confirm="() => onDelete(record.key)">
            <a href="javascript:;">删除行</a>
          </a-popconfirm>
        </template>
      </a-table>
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
const columns = [
  {
    title: "费用摘要",
    dataIndex: "ExpenseTitle",
    scopedSlots: { customRender: "ExpenseTitle" },
    align: "center",
  },
  {
    title: "费用类型",
    dataIndex: "ExpenseType",
    scopedSlots: { customRender: "ExpenseType" },
    align: "center",
  },
  {
    title: "费用原因",
    dataIndex: "ExpenseReason",
    scopedSlots: { customRender: "ExpenseReason" },
    align: "center",
  },
  {
    title: "费用类别",
    dataIndex: "ExpenseClass",
    scopedSlots: { customRender: "expenseClass" },
    align: "center",
  },
  {
    title: "费用金额",
    dataIndex: "ExpenseMoney",
    scopedSlots: { customRender: "expenseMoney" },
    align: "center",
  },
  {
    title: "费用日期",
    dataIndex: "ExpenseDate",
    scopedSlots: { customRender: "expenseDate" },
    align: "center",
  },
  {
    title: "成本中心",
    dataIndex: "Cost",
    scopedSlots: { customRender: "cost" },
    align: "center",
  },
  {
    title: "内部订单",
    dataIndex: "Internal",
    scopedSlots: { customRender: "internal" },
    align: "center",
  },
  {
    title: "备注说明",
    dataIndex: "Remark",
    scopedSlots: { customRender: "remark" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      bankList,
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      dataSource: [],
      columns,
      form: {
        orderNo: "",
        enterpriseId: "",
        supplierCode: "",
        bank: "",
        bankCard: "",
        taxpayerIdNumber: "",
        currency: "",
        rate: "",
        isDeduct: false,
        isInternal: false,
        source: "",
        expenseCycle: "",
        remark: "",
        children: [],
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
        id :order.Id,
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
