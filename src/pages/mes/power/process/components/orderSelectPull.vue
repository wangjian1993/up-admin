<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2022-01-04 18:08:45
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/components/orderSelectPull.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="进站选择" @cancel="close" @ok="handleOk" centered width="70%">
      <a-descriptions :column="6">
        <a-descriptions-item label="工单">
          {{ orderSelectList[0].MoCode }}
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂">
          {{ userLineData.PlantName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产车间">
          {{ userLineData.WorkshopName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产产线">
          {{ userLineData.LineName }}
        </a-descriptions-item>
        <a-descriptions-item label="打印人">
          {{ userLineData.UserName }}
        </a-descriptions-item>
        <a-descriptions-item label="打印时间">
          {{ splitData(userLineData.DATETIME_CREATED) }}
        </a-descriptions-item>
      </a-descriptions>
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="orderSelectList"
            :size="size"
            :pagination="false"
            :rowKey="(orderSelectList) => orderSelectList.ProPlanId"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              type: selectionType,
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="receiveQty" slot-scope="text, record">
              <a-input-number v-if="!record.IsWrite" disabled :min="0" v-model="record.ReportQty" />
              <a-input-number v-else :disabled="!record.isInput" :min="0" v-model="record.receiveQty" />
            </template>
          </a-table>
        </a-card>
      </div>
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
    title: "生产计划批次",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
    width: 120,
  },
  {
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "计划生产日期",
    dataIndex: "PlanDate",
    scopedSlots: { customRender: "PlanDate" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品名",
    dataIndex: "ProName",
    scopedSlots: { customRender: "ProName" },
    align: "center",
    width: 120,
  },
  {
    title: "计划车间",
    dataIndex: "WorkshopName",
    scopedSlots: { customRender: "WorkshopName" },
    align: "center",
    width: "80px",
  },
  {
    title: "计划产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
    width: "80px",
  },
  {
    title: "计划数量",
    dataIndex: "PlanQty",
    scopedSlots: { customRender: "PlanQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "状态",
    dataIndex: "StatusName",
    scopedSlots: { customRender: "StatusName" },
    align: "center",
    width: "80px",
  },
   {
    title: "已进站数量",
    dataIndex: "StartedQty",
    scopedSlots: { customRender: "StartedQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "接收数量",
    dataIndex: "receiveQty",
    scopedSlots: { customRender: "receiveQty" },
    align: "center",
    width: "80px",
  },
];
import { splitData } from "@/utils/util.js";
export default {
  props: ["orderSelectList", "userLineData", "selectType"],
  data() {
    return {
      data: [],
      columns,
      size: "small",
      visible: true,
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
      isPrint: false,
      selectedRowKeys: [],
      selectionType: "checkbox",
    };
  },
  created() {
    this.$nextTick(() => {
      console.log(this.selectType);
      if (this.selectType == "Multiple") {
        this.selectionType = "checkbox";
      } else {
        this.selectionType = "radio";
      }
    });
  },
  methods: {
    splitData,
    closeModal() {
      this.isPrint = true;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      if (selectedRowKeys.length > 0) {
        this.orderSelectList.map((items) => {
          items.isInput = this.setIsInput(items.ProPlanId);
        });
      } else {
        this.orderSelectList.map((items) => {
          items.isInput = false;
        });
      }
    },
    setIsInput(id) {
      return this.selectedRowKeys.includes(id);
    },
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let list = [];
      if (this.selectedRowKeys.length <= 0) {
        this.close();
        return
      }
      this.orderSelectList.map((items) => {
        if (this.setIsInput(items.ProPlanId)) {
          if (!items.IsWrite) {
            items.receiveQty = items.ReportQty;
          }
          list.push(items);
        }
      });
      this.$emit("succeedOrder", list);
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
/deep/.ant-table {
  min-height: 0vh;
}
</style>
