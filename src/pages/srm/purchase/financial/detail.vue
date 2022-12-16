<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2022-12-12 17:06:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/financial/detail.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="供应商费用单明细" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :bodyStyle="{ padding: '5px 10px' }">
      <a-spin tip="loading..." :spinning="loading">
        <a-descriptions :column="5" bordered size="small">
          <a-descriptions-item v-for="(item, index) in info1" :key="index" :label="item.title">
            {{ orderList[item.dataIndex] }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions style="margin:10px 0" :column="5" title="基本信息" bordered size="small">
          <a-descriptions-item v-for="(item, index) in info2" :key="index" :label="item.title">
            {{ orderList[item.dataIndex] }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions style="margin:10px 0" :column="3" title="物流信息" bordered size="small">
          <a-descriptions-item v-for="(item, index) in info3" :key="index" :label="item.title">
            {{ orderList[item.dataIndex] }}
          </a-descriptions-item>
        </a-descriptions>
        <a-card title="产品明细" class="card" :bordered="false" :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="detailList" size="small" :pagination="false" :rowKey="(list) => list.ItemCode" bordered>
            <template slot="footer">
              <a-table ref="total-table" class="total-table" :columns="columnKeys" :dataSource="totalData" :showHeader="false" :bordered="false" :pagination="false" size="small" />
            </template>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="productTitle">
              <p>产品编码</p>
              <p>产品名称</p>
              <p>产品规格</p>
            </template>
            <template slot="product_info" slot-scope="text, record">
              <p>{{ record.ItemCode }}</p>
              <p>{{ record.ItemName }}</p>
              <p>{{ record.ItemSpecification }}</p>
            </template>
            <template slot="PurchaseWarehouseTitle">
              <p>收货仓位</p>
              <p>收货仓库</p>
            </template>
            <template slot="PurchaseWarehouse" slot-scope="text, record">
              <p>{{ record.PurchaseWarehousePosition }}</p>
              <p>{{ record.PurchaseWarehouse }}</p>
            </template>
            <template slot="DrawingNoTitle">
              <p>图号</p>
              <p>订单图号</p>
            </template>
            <template slot="DrawingNo" slot-scope="text, record">
              <p>{{ record.DrawingNo || "" }}</p>
              <p>{{ record.OrderDrawingNo || "" }}</p>
            </template>
            <template slot="QtyTtile">
              <p>采购数量</p>
              <p>采购单位</p>
            </template>
            <template slot="Qty" slot-scope="text, record">
              <p>{{ record.Qty }}</p>
              <p>{{ record.Unit }}</p>
            </template>
            <template slot="PriceQtyTitle">
              <p>计价数量</p>
              <p>计价单位</p>
              <p>是否赠品</p>
            </template>
            <template slot="PriceQty" slot-scope="text, record">
              <p>{{ record.PriceQty }}</p>
              <p>{{ record.PriceUnit }}</p>
              <p>{{ record.PriceCode }}</p>
            </template>
            <template slot="PriceTitle">
              <p>单位</p>
              <p>税率</p>
            </template>
            <template slot="Price" slot-scope="text, record">
              <p>{{ record.Price }}</p>
              <p>{{ record.Rate }}</p>
            </template>
            <template slot="MoneyTaxTitle">
              <p>含税金额</p>
              <p>不含税金额</p>
              <p>税额</p>
            </template>
            <template slot="MoneyTax" slot-scope="text, record">
              <p>{{ record.MoneyTax }}</p>
              <p>{{ record.Money }}</p>
              <p>{{ record.Tax }}</p>
            </template>
          </a-table>
        </a-card>
      </a-spin>
      <div
        :style="{
          position: 'absolute',
          right: '50px',
          top: 0,
          width: '100%',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button  type="primary" :style="{ marginRight: '8px' }" @click="handleCancel">
          作废
        </a-button>
        <a-button  type="primary" :style="{ marginRight: '8px' }" @click="handleCancel">
          打印
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { info1, info2, info3, columns, columnKeys } from "./data/detail";
import { getExpense } from "@/services/srm.js";
import { splitData } from "@/utils/util.js";
export default {
  props: ["detailId"],
  data() {
    return {
      size: "small",
      info1,
      info2,
      info3,
      columns,
      columnKeys,
      totalData: [
        {
          totalMoney: "合计金额:0",
        },
      ],
      visible: true,
      orderList: [],
      detailList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 100, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      ConfigList: [],
      loading: false,
      treeData: [],
      isModelInfo: false,
      modelData: [],
      antDescriptionsRow: "",
      isUnfold: false,
      isCloneBtn: false,
      scrollY: "",
    };
  },
  created() {
    this.getDetailList();
  },
  methods: {
    splitData,
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isModelInfo = false;
      this.isUnfold = false;
    },
    getDetailList() {
      this.loading = true;
      let params = {
        id: this.detailId,
      };
      getExpense(params, "single").then((res) => {
        if (res.data.success) {
          this.orderList = res.data.data.order;
          this.detailList = res.data.data.detailList;
          let price = 0;
          this.detailList.forEach((item) => {
            price += item.ExpenseMoney;
          });
          this.totalData = [
            {
              totalMoney: "合计金额:" + price,
            },
          ];
        }
        this.loading = false;
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList();
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
      this.isUnfold = false;
    },
  },
};
</script>

<style lang="less" scoped>
p {
  padding: 0;
  margin: 0;
}
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/.ant-table {
  font-size: 10px;
}
/deep/.ant-descriptions-title {
  margin-bottom: 0;
}
/deep/.ant-table-row-cell-break-word {
  white-space: nowrap;
  overflow: hidden;
}
/deep/.ant-descriptions-item-content {
  font-size: 10px;
}
</style>
