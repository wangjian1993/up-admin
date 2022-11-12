<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2022-11-03 15:04:00
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/components/consigneeDetail.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="送货详情" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :bodyStyle="{ padding: '5px 10px' }">
      <a-spin tip="loading..." :spinning="loading">
        <a-descriptions :column="5" bordered size="small">
          <a-descriptions-item v-for="(item, index) in info1" :key="index" :label="item.title">
            {{ orderList[item.dataIndex] }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions style="margin:10px 0" :column="5" title="物流信息" bordered size="small">
          <a-descriptions-item v-for="(item, index) in info3" :key="index" :label="item.title">
            {{ orderList[item.dataIndex] }}
          </a-descriptions-item>
        </a-descriptions>
        <a-card title="收货明细" class="card" :bordered="false" :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="detailList" size="small" :pagination="false" :scroll="{  x: true }" :rowKey="(list) => list.ItemCode" bordered>
            <template slot="footer">
              <a-table ref="total-table" class="total-table" :columns="columnKeys" :dataSource="totalData" :showHeader="false" :pagination="false" size="small" />
            </template>
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
        </a-card>
      </a-spin>
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
        <!-- <a-button type="danger" :style="{ marginRight: '8px' }" @click="handleCancel">
          退回
        </a-button>
         <a-button  type="primary" :style="{ marginRight: '8px' }" @click="handleCancel">
          同意
        </a-button>
        <a-button  type="primary" :style="{ marginRight: '8px' }" @click="handleCancel">
          提醒
        </a-button> -->
        <a-button type="primary" :style="{ marginRight: '8px' }" @click="handleCancel">
          打印
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { info1, info3, columns, columnKeys } from "../data/consigneeDetail";
import { getClientDelivery } from "@/services/srm.js";
import { splitData } from "@/utils/util.js";
export default {
  props: ["orderId"],
  data() {
    return {
      size: "small",
      info1,
      info3,
      columns,
      columnKeys,
      totalData: [
        {
          totalQty: "收货数量合计:0",
          priceQty: "计价数量合计:0",
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
        id: this.orderId,
      };
      getClientDelivery(params, "single").then((res) => {
        if (res.data.success) {
          this.orderList = res.data.data.order;
          this.detailList = res.data.data.detail;
          let qty = 0;
          let price = 0;
          this.detailList.forEach((item) => {
            qty += item.Qty;
            price += item.PriceQty;
          });
          this.totalData = [
            {
              totalQty: "收货数量合计:" + qty,
              priceQty: "计价数量合计:" + price,
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
/deep/.ant-table-footer {
  padding: 0;
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
