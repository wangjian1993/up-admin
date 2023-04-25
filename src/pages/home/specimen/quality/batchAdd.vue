<template>
  <div>
    <a-modal title="添加品质判定" v-if="visible" :visible="visible" :footer="null" destoryOnClose @cancel="handleCancel" width="80%">
      <a-form layout="horizontal" :form="searchForm" v-if="!isEdit">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="公司名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['enterpriseId']" style="width: 200px" placeholder="请选择业务公司">
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
      <a-table bordered :data-source="dataSource" :pagination="false" :scroll="{ y: 500 }" :rowKey="(dataSource, index) => dataSource.Id" :columns="columns">
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定录入签样?" @confirm="() => onAdd(record)">
              <a style="margin-right: 8px" v-if="record.Status !== '已录入签样'">
                <a-icon type="edit" />
                录入签样
              </a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getQualitySpecimen, setQualitySpecimen } from "@/services/web.js";
const columns = [
  {
    title: "采购订单号",
    dataIndex: "PuchaseOrderNo",
    scopedSlots: { customRender: "PuchaseOrderNo" },
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
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
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
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
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
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  props: ["editData", "isEdit", "plantList"],
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
    searchBtn() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          let params = {
            docno: values.docno,
            enterpriseId: values.enterpriseId,
          };
          getQualitySpecimen(params, "getarrivaldocnolist").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.List;
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
    onAdd(record) {
      let params = {
        DocNo: record.DocNo,
        ItemCode: record.ItemCode,
        ItemName: record.ItemName,
        ItemSpecification: record.ItemSpecification,
        DrawingNo: record.DrawingNo,
        SupplierCode: record.SupplierCode,
        Supplier: record.SupplierName,
        CompanyId: record.CompanyId,
        PuchaseOrderNo:record.PuchaseOrderNo
      };
      setQualitySpecimen(params, "addregister").then((res) => {
        if (res.data.success) {
          this.$message.success("录入成功!");
          this.searchBtn();
          this.$emit("success");
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
