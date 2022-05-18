<!--
 * @Author: max
 * @Date: 2021-11-26 13:41:55
 * @LastEditTime: 2022-05-18 18:22:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/HistoryAmount.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="历史价格" @cancel="close" width="60%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="3">
            <a-descriptions-item label="品号">
              {{ historyAmountData.ChildCode }}
            </a-descriptions-item>
            <a-descriptions-item label="品名">
              {{ historyAmountData.ChildName }}
            </a-descriptions-item>
            <a-descriptions-item label="规格">
              {{ historyAmountData.ChildSpecification }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" :size="size" :scroll="{ y: 600 }" :pagination="false" :rowKey="(dataSource) => dataSource.Id" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="DatetimeCreated" slot-scope="text">
                <span>{{ timeSplit(text) }}</span>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
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
    title: "日期",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
  },
  {
    title: "价格",
    dataIndex: "Amount",
    align: "center",
  },
];
import { getCostConfig } from "@/services/web.js";
export default {
  props: ["historyAmountData", "info", "amounType"],
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
    };
  },
  created() {
    this.getList();
    console.log(this.historyAmountData);
  },
  methods: {
    timeSplit(str) {
      let time = str.replace(/-/g, "/");
      return time.replace("T", " ");
    },
    close() {
      this.$emit("closeModal");
    },
    calField(tree) {
      tree.forEach((node) => {
        if (node.ChildInfo && node.ChildInfo.length > 0) {
          // console.log(node.children)
          this.calField(node.ChildInfo);
          node.Amount = node.Amount * 1 + node.ChildInfo.reduce((sum, item) => ((sum += item.Amount), parseFloat(sum.toFixed(4))), 0);
        } else {
          let sum = node.Amount * 1;
          node.Amount = parseFloat(sum.toFixed(4));
          delete node.ChildInfo;
        }
      });
      return tree;
    },
    getList() {
      this.loading = true;
      console.log(this.historyAmountData)
      let parmas = {
        childCode: this.historyAmountData.ChildCode,
        enterpriseid: this.info.EnterpriseId,
        plantid: this.info.PlantId,
        itemcode: this.historyAmountData.ItemCode,
        lastcode:this.historyAmountData.LastCode
      };
      let url = "";
      if (this.amounType == 1) {
        url = "getpricehistory";
      } else {
        url = "getpricehistorysum";
      }
      getCostConfig(parmas, url).then((res) => {
        if (res.data.success) {
          if (this.amounType == 1) {
            this.dataSource = res.data.data.PriceHistory;
          } else {
            this.dataSource = res.data.data.PriceHistorySum;
            this.calField(this.dataSource);
          }
          const pagination = { ...this.pagination };
          pagination.total = this.dataSource.length;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
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
