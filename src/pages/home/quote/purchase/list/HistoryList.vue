<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2021-09-13 18:40:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/HistoryList.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="历史版本" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="3">
            <a-descriptions-item label="需求公司">
              {{ historyData.EnterpriseName }}
            </a-descriptions-item>
            <a-descriptions-item label="需求工厂">
              {{ historyData.PlantName }}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{ historyData.ItemCode }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(dataSource) => dataSource.Id" bordered>
              <template slot="StatusCheck" slot-scope="record">
                <div>
                  <a-tag color="green" v-if="record == 'Y'">已审核</a-tag>
                  <a-tag color="red" v-else>未审核</a-tag>
                </div>
              </template>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template v-if="historyType == 'purchase'" slot="action" slot-scope="text, record">
                <div>
                  <a-popconfirm v-if="record.StatusCheck == 'N'" title="确定审核?" @confirm="() => onAudit(record)">
                    <a style="margin-right: 8px">
                      <a-icon type="check-circle" />
                      审核
                    </a>
                  </a-popconfirm>
                  <a style="margin-right: 8px" @click="details(record.Id)">
                    <a-icon type="profile" />
                    详情
                  </a>
                  <a-popconfirm title="确定删除?" v-if="record.StatusCheck == 'N'" @confirm="() => onDelete(record)">
                    <a style="margin-right: 8px">
                      <a-icon type="delete" />
                      删除
                    </a>
                  </a-popconfirm>
                  <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link">
                      更多
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item key="0" @click="handleExcel(record.Id)">导出</a-menu-item>
                      <a-menu-item key="1" @click="reloadCost(record.Id, 'COPY')">复制报价</a-menu-item>
                      <a-menu-item key="2" @click="reloadCost(record.Id, 'ANEW')">重新报价</a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </template>
              <template v-else slot="action" slot-scope="text, record">
                <div>
                  <a style="margin-right: 8px" @click="details(record.Id)">
                    <a-icon type="profile" />
                    详情
                  </a>
                  <a style="margin-right: 8px" @click="handleExcel(record.Id)">
                    <a-icon type="export" />
                    导出
                  </a>
                </div>
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
    width: "5%",
  },
  {
    title: "需求公司",
    dataIndex: "EnterpriseName",
    scopedSlots: { customRender: "description" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    align: "center",
  },
  {
    title: "产品大类",
    dataIndex: "ItemSort",
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    align: "center",
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    align: "center",
  },
  {
    title: "物料成本",
    dataIndex: "MaterialCost",
    align: "center",
    width: "5%",
  },
  {
    title: "最终成本",
    dataIndex: "FinalCost",
    align: "center",
    width: "5%",
  },
  {
    title: "状态",
    dataIndex: "StatusCheck",
    scopedSlots: { customRender: "StatusCheck" },
    align: "center",
    width: "5%",
  },
  {
    title: "创建日期",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
  },
  {
    title: "最新版本",
    dataIndex: "QuoteVersion",
    scopedSlots: { customRender: "QuoteVersion" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
import { getCostConfig } from "@/services/web.js";
export default {
  props: ["historyData", "historyType"],
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
  },
  methods: {
    //复制版本
    reloadCost(id, type) {
      this.$emit("reloadCost", id, type);
    },
    //详情
    details(id) {
      this.$emit("details", id);
    },
    //导出
    handleExcel(id) {
      this.$emit("handleExcel", id);
    },
    close() {
      this.$emit("closeModal");
    },
    getList() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.historyData.EnterpriseId,
        plantid: this.historyData.PlantId,
        itemcode: this.historyData.ItemCode,
      };
      getCostConfig(parmas, "getquotehistorycommon").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
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
