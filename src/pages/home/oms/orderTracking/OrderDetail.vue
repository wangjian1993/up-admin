<!--
 * @Author: max
 * @Date: 2021-11-25 15:10:49
 * @LastEditTime: 2021-11-29 08:48:33
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
import { getOrderApi } from "@/services/web.js";
import PassageDetail from "./PassageDetail.vue";
import { detailColumns } from "./order.data";
export default {
  components: { PassageDetail },
  props: ["detailData"],
  data() {
    return {
      size: "small",
      visible: true,
      columns: detailColumns,
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
