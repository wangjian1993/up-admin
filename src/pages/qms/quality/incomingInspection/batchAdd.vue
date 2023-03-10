<template>
  <div>
    <a-modal :title="isEdit ? '修改品质判定' : '添加品质判定'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="80%">
      <a-form layout="horizontal" :form="searchForm" v-if="!isEdit">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="到货通知单" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入到货通知单" v-decorator="['docno']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span>
                <a-button type="primary" @click="searchBtn">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <a-table bordered :data-source="dataSource" :pagination="false" :scroll="{ y: 500 }" :rowKey="(dataSource, index) => dataSource.Id" :rowSelection="!isEdit ? { selectedRowKeys: selectedRowKeys, onChange: onSelectChange } : undefined" class="j-table-force-nowrap" :columns="columns">
        <template slot="TestItem" slot-scope="text, record">
          <div>
            <a-select v-model="record.TestItem" :disabled="!record.isInput" style="width: 150px" placeholder="请选择测试结果">
              <a-select-option v-for="item in paramsItem.IQC_INCOMING_TEST_ITEM" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
            </a-select>
          </div>
        </template>
        <template slot="TestResult" slot-scope="text, record">
          <div>
            <a-select v-model="record.TestResult" :disabled="!record.isInput" style="width: 100px" placeholder="请选择测试结果">
              <a-select-option v-for="item in paramsItem.IQC_INCOMING_TEST_ITEM_RESULT" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
            </a-select>
          </div>
        </template>
        <template slot="Remarks" slot-scope="text, record">
          <div>
            <a-input style="width:100px" :disabled="!record.isInput" v-model="record.Remarks" size="small" />
          </div>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { setDoList, setIncomingTest } from "@/services/qms.js";
import { getParamData } from "@/services/admin.js";
const columns = [
  {
    title: "PO号",
    dataIndex: "DocNo",
    scopedSlots: { customRender: "DocNo" },
    align: "center",
  },
  {
    title: "业务公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
  },
  {
    title: "供应商",
    dataIndex: "SupplierFullName",
    scopedSlots: { customRender: "SupplierFullName" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ItemDescription",
    scopedSlots: { customRender: "ItemDescription" },
    align: "center",
    width: 150,
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width: 200,
  },
  {
    title: "来料数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: 90,
  },
  {
    title: "测试项目",
    dataIndex: "TestItem",
    scopedSlots: { customRender: "TestItem" },
    align: "center",
    width: 170,
  },
  {
    title: "测试结果",
    dataIndex: "TestResult",
    scopedSlots: { customRender: "TestResult" },
    align: "center",
    width: 150,
  },
  {
    title: "备注",
    dataIndex: "Remarks",
    scopedSlots: { customRender: "Remarks" },
    align: "center",
  },
];
export default {
  props: ["editData", "isEdit", "paramsItem"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      searchForm: this.$form.createForm(this),
      // paramsList: [],
      // paramsItem: [],
      dataSource: [],
      columns,
      count: 2,
      selectedRowKeys: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.dataSource = [...this.editData];
      this.dataSource.forEach((item) => {
        item.isInput = true;
      });
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    getParamsData() {
      this.paramsList.forEach((item) => {
        let params = {
          groupcode: item,
        };
        getParamData(params).then((res) => {
          if (res.data.success) {
            this.paramsItem[item] = res.data.data;
          }
        });
      });
    },
    searchBtn() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          let params = {
            docno: values.docno,
          };
          setDoList(params).then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              this.dataSource.forEach((item, index) => {
                item.Id = item.ItemCode + "_" + index;
              });
            }
          });
        }
      });
    },
    closeModal() {
      this.isCompany = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    setIsInput(id) {
      return this.selectedRowKeys.includes(id);
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log("selectedRowKeys==", selectedRowKeys);
      if (selectedRowKeys.length > 0) {
        this.dataSource.map((items) => {
          items.isInput = this.setIsInput(items.Id);
        });
      } else {
        this.dataSource.map((items) => {
          items.isInput = false;
        });
      }
      console.log(" this.dataSource====", this.dataSource);
    },
    handleOk() {
      if (this.isEdit) {
        let params = [];
        this.dataSource.forEach((item) => {
          params.push({
            Id: item.id,
            TestItem: item.TestItem,
            TestResult: item.TestResult,
            Remarks: item.Remarks || "",
          });
        });
        setIncomingTest(params, "multiple/update").then((res) => {
          if (res.data.success) {
            this.$message.success("编辑成功!");
            this.$emit("closeModal");
            this.$emit("success");
          }
        });
      } else {
        let params = [];
        this.dataSource.forEach((item) => {
          if (this.selectedRowKeys.includes(item.Id)) {
            params.push({
              EnterId: item.CompanyCode,
              ArrivalOrderNo: item.DocNo,
              PurchaseOrderNo: item.PuchaseOrderNo,
              MitemCode: item.ItemCode,
              MitemName: item.ItemDescription,
              MitemSpec: item.ItemSpecification,
              SupplierCode: item.SupplierCode,
              SupplierName: item.SupplierFullName,
              InComingQty: item.Qty,
              Unit: item.Unit,
              TestItem: item.TestItem,
              TestResult: item.TestResult,
              Remarks: item.Remarks,
            });
          }
        });
        setIncomingTest(params, "multiple/add").then((res) => {
          if (res.data.success) {
            this.$message.success("添加成功!");
            this.$emit("closeModal");
            this.$emit("success");
          }
        });
      }
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
