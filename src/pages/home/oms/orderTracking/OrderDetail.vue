<!--
 * @Author: max
 * @Date: 2021-11-25 15:10:49
 * @LastEditTime: 2021-12-09 17:13:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/OrderDetail.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="物料及采购详情" @cancel="close" width="100%" :footer="null" centered>
      <a-spin tip="数据提取中..." :spinning="loading">
        <div>
          <a-descriptions columns="4">
            <a-descriptions-item label="销售公司">
              {{ detailData.CompanyName }}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{ detailData.MitemCode }}
            </a-descriptions-item>
            <a-descriptions-item label="销售订单">
              {{ detailData.SalesOrderNo }}
            </a-descriptions-item>
            <a-descriptions-item label="工单">
              {{ detailData.MoCode }}
            </a-descriptions-item>
            <a-descriptions-item label="欠数物料齐套数量">
              {{ MinMitemCompleteQty }}
            </a-descriptions-item>
            <a-descriptions-item label="欠数预警信息">
              {{ PurchaseDeficiencyInfo }}
            </a-descriptions-item>
          </a-descriptions>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" :size="size" :scroll="{ y: 600, x: true }" :pagination="pagination" :rowKey="(dataSource, index) => dataSource.ErpPlantId + index" @change="handleTableChange" bordered>
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
import { getOrderApi } from "@/services/web.js";
import PassageDetail from "./PassageDetail.vue";
import { detailColumns, detailColumnsP } from "./order.data";
export default {
  components: { PassageDetail },
  props: ["detailData"],
  data() {
    return {
      size: "small",
      visible: true,
      columns: [],
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
      MinMitemCompleteQty: 0,
      PurchaseDeficiencyInfo: "",
    };
  },
  created() {
    this.getList();
    this.columns = this.detailData.MitemProperty === "P" ? detailColumnsP : detailColumns;
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
    getList(type) {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        cacheid: this.detailData.CacheId,
      };
      let url=''
      if (type == "paging") {
        url = this.detailData.MitemProperty === "P" ? "getrawmaters" : "getcachemobomlist";
      } else {
        url = this.detailData.MitemProperty === "P" ? "getrawmaters" : "getmobomlist";
      }
      getOrderApi(params, url).then((res) => {
        if (res.data.success) {
          this.MinMitemCompleteQty = res.data.data.MinMitemCompleteQty || 0;
          this.PurchaseDeficiencyInfo = res.data.data.PurchaseDeficiencyInfo || "";
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
      this.getList("paging");
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
