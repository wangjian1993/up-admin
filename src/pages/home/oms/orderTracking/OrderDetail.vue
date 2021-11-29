<!--
 * @Author: max
 * @Date: 2021-11-25 15:10:49
 * @LastEditTime: 2021-11-27 10:43:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/OrderDetail.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="`销售订单:${detailData.MoCode}`" @cancel="close" width="100%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" :size="size" :scroll="{ y: 600 }" :pagination="pagination" :rowKey="(dataSource, index) => dataSource.ErpPlantId + index" @change="handleTableChange" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <div>
                  <a style="margin-right: 8px" @click="detail(record)">
                    查看在途明细
                  </a>
                </div>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
    <PassageDetail v-if="isDetail" :detailList="detailList" @closeModal="closeModal" />
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    align: "center",
    width: 100,
  },
  {
    title: "物料品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 100,
  },
  {
    title: "物料品名",
    dataIndex: "MitemName",
    align: "center",
  },
  {
    title: "欠数数量",
    dataIndex: "DeficiencyQty",
    align: "center",
    width: 80,
  },
  {
    title: "标准用量",
    dataIndex: "StandardQty",
    align: "center",
  },
  {
    title: " 总需求数量",
    dataIndex: "RequirementQty",
    align: "center",
    width: 100,
  },
  {
    title: "总库存数量",
    dataIndex: "InventoryQty",
    align: "center",
    width: 100,
  },
  {
    title: "预留用量",
    dataIndex: "ReservedQty",
    align: "center",
    width: 80,
  },
  {
    title: "可用用量",
    dataIndex: "AvailableQty",
    scopedSlots: { customRender: "AvailableQty" },
    align: "center",
    width: 80,
  },
  {
    title: "总欠数量",
    dataIndex: "TotalDeficiencyQty",
    scopedSlots: { customRender: "TotalDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "采购在途总数",
    dataIndex: "PurchaseTransitQty",
    scopedSlots: { customRender: "PurchaseTransitQty" },
    align: "center",
    width: 120,
  },
  {
    title: "采购在途预留用量",
    dataIndex: "PurchaseTransitReservedQty",
    scopedSlots: { customRender: "PurchaseTransitReservedQty" },
    align: "center",
    width: 135,
  },
  {
    title: "采购在途可用用量",
    dataIndex: "PurchaseTransitAvailableQty",
    scopedSlots: { customRender: "PurchaseTransitAvailableQty" },
    align: "center",
    width: 135,
  },
  {
    title: "预计最早到货时间",
    dataIndex: "EstimatedEarliestArrivalDateTime",
    scopedSlots: { customRender: "EstimatedEarliestArrivalDateTime" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
    width: 135,
  },
  {
    title: "采购欠数",
    dataIndex: "PurchaseDeficiencyQty",
    scopedSlots: { customRender: "PurchaseDeficiencyQty" },
    align: "center",
    width: 80,
  },
  {
    title: "采购在途明细",
    scopedSlots: { customRender: "action" },
    width: 110,
  },
];
import { getOrderApi } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
import PassageDetail from "./PassageDetail.vue";
export default {
  components: { PassageDetail },
  props: ["detailData"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      dataSource: [],
      loading: false,
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
      isDetail: false,
      detailList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isDetail = false;
    },
    detail(item) {
      this.isDetail = true;
      this.detailList = item;
    },
    getList() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        cacheid: this.detailData.CacheId,
      };
      getOrderApi(params, "getmobomlist").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    //分压
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList();
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
</style>
