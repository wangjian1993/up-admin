<template>
  <div>
    <a-modal v-model="visible" title="订单列表" @cancel="close" @ok="handleOk" centered width="90%">
      <a-row>
        <a-col :span="20">
          <div class="search-box">
            <a-form layout="horizontal" :form="searchForm">
              <a-row>
                <!-- <a-col :md="6" :sm="24">
                  <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-decorator="['code']" style="width: 200px" placeholder="请选择生产工厂">
                      <a-select-option v-for="item in plantList" :key="item.Code" :value="item.Code">{{ item.Name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col> -->
                <a-col :md="8" :sm="24">
                  <a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input placeholder="请输入公司名称" allowClear style="width:200px" v-decorator="['searcValue']" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <span>
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <!-- 列表 -->
          <div class="tab">
            <a-table
              :columns="columns"
              :data-source="list"
              :size="size"
              :loading="loading"
              :scroll="{ y: 500 }"
              :pagination="pagination"
              @change="handleTableChange"
              :rowKey="(list, index) => list.Id"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                onSelect: onSelect,
                onSelectAll: onSelectAll,
              }"
              bordered
            >
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="purchasedetailidTitle">
                <p>交货日期</p>
                <p>排定日期</p>
              </template>
              <template slot="purchasedetailid" slot-scope="text, record">
                <p>{{ record.PurchaseDatetime }}</p>
                <p>{{ record.deliverydatetime }}</p>
              </template>
              <template slot="ReceiptWarehouseTitle">
                <p>交货数量</p>
                <p>排定数量</p>
              </template>
              <template slot="deliveryqty" slot-scope="text, record">
                <p>{{ record.Qty }}</p>
                <p>{{ record.Unit }}</p>
              </template>
              <template slot="priceqtyTitle">
                <p>计价数量</p>
                <p>计价单位</p>
              </template>
              <template slot="priceqty" slot-scope="text, record">
                <p>{{ record.PriceQty }}</p>
                <p>{{ record.PriceUnit }}</p>
              </template>
            </a-table>
          </div>
        </a-col>
        <a-col :span="4">
          <div>
            <a-tag style="margin:4px 4px" v-for="item in selectedRows" :key="item.Id" closable @close="() => handleClose(item.Id)">
              {{ item.ItemCode }}
            </a-tag>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "项次",
    dataIndex: "Sort",
    scopedSlots: { customRender: "Sort" },
    align: "center",
  },
  {
    title: "产品编码",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
  },
  {
    title: "产品名称",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
    width: 150,
  },
  {
    title: "产品规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width: 350,
  },
  {
    title: "客户单号(项次)",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
  },
  {
    title: "收货仓库",
    dataIndex: "PurchaseWarehouse",
    scopedSlots: { customRender: "PurchaseWarehouse" },
    align: "center",
  },
  {
    dataIndex: "purchasedetailid", //交货日期
    scopedSlots: { customRender: "purchasedetailid" },
    slots: { title: "purchasedetailidTitle" },
    align: "center",
  },
  {
    dataIndex: "deliveryqty", //交货数量
    scopedSlots: { customRender: "deliveryqty" },
    slots: { title: "deliveryqtyTitle" },
    align: "center",
  },
  {
    dataIndex: "ReceiptWarehouse", //送货数量
    scopedSlots: { customRender: "ReceiptWarehouse" },
    slots: { title: "ReceiptWarehouseTitle" },
    align: "center",
  },
  {
    dataIndex: "priceqty", //计价数量
    scopedSlots: { customRender: "priceqty" },
    slots: { title: "priceqtyTitle" },
    align: "center",
  },
  {
    title: "订单备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
];
import { getClientDelivery } from "@/services/srm.js";
export default {
  props: ["orderType", "orderList","plantCode"],
  data() {
    return {
      size: "small",
      visible: true,
      isAddModal: false,
      columns,
      list: [],
      loading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      enterList: [],
      enterpriseid: "",
      tagList: [],
      selectedRows: [],
      plantList: [],
    };
  },
  created() {
    this.search();
    if (this.orderList.length > 0) {
      this.selectedRows = this.orderList;
      this.orderList.forEach((item) => {
        this.selectedRowKeys.push(item.Id);
      });
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    handleClose(id) {
      this.selectedRowKeys = this.selectedRowKeys.filter((item) => item != id);
      this.selectedRows = this.selectedRows.filter((item) => item.Id != id);
      console.log(this.selectedRows);
    },
    //多选
    onSelectChange(selectedRowKeys) {
      //   console.log("selectedRows==", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      console.log("this.selectedRowKeys", this.selectedRowKeys);
      //   console.log("this.selectedRowKeys==", this.selectedRowKeys);
      //   this.tagList = selectedRows;
    },
    onSelect(record, selected) {
      console.log("record===", record);
      if (selected) {
        this.selectedRows.push(record);
      }

      if (!selected) {
        const delIndex = this.selectedRows.findIndex((val) => {
          return val.Id === record.Id;
        });
        this.selectedRows.splice(delIndex, 1);
      }
      //   console.log(this.selectedRows)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected) {
        this.selectedRows = this.selectedRows.concat(changeRows);
      }
      if (!selected) {
        let selectedRows = JSON.parse(JSON.stringify(this.selectedRows));
        const delIndex = [];
        selectedRows.forEach((item, index) => {
          changeRows.forEach((val) => {
            if (item.Id === val.Id) {
              delIndex.push(index);
            }
          });
        });
        delIndex.forEach((item) => {
          delete selectedRows[item];
        });
        selectedRows = selectedRows.filter((item) => {
          return item !== undefined;
        });
        this.selectedRows = selectedRows;
      }
      //   console.log(this.selectedRows)
    },
    handleOk() {
      this.$emit("closeModal");
      this.$emit("success", this.selectedRows);
    },
    reset() {
      this.search();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.data = [];
          this.pagination.total = 0;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            code: this.plantCode,
            keyword: values.keyword,
          };
          let url = this.orderType === 1 ? "getpurchaseorder" : "getreturnorder";
          getClientDelivery(params, url).then((res) => {
            if (res.data.success) {
              this.list = res.data.data.list;
              this.list.forEach((item, index) => {
                item.Id = item.ItemCode + "-" + index + "_" + item.OrderNo;
              });
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
              this.pagination = pagination;
              this.loading = false;
            }
          });
          // do something
        }
      });
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.search();
    },
  },
  components: {},
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
</style>
