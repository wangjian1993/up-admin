<!--
 * @Author: max
 * @Date: 2021-12-16 13:58:52
 * @LastEditTime: 2022-01-06 09:59:00
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/identification.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="打印标识卡" @cancel="close" okText="确认打印" @ok="handleOk" centered width="70%">
      <a-descriptions :column="5">
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
          {{ splitData(userLineData.DateCreated) }}
        </a-descriptions-item>
      </a-descriptions>
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="data" :size="size" :pagination="false" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="Remarks" slot-scope="text, record">
              <a-input v-model="record.Remarks" />
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
    <print v-if="isPrint" :printData="data" @closeModal="closeModal"/>
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
    title: "订单号",
    dataIndex: "MoCode1",
    scopedSlots: { customRender: "MoCode1" },
    align: "center",
    width: "120px",
  },
  {
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "时间",
    dataIndex: "DateTime",
    scopedSlots: { customRender: "DateTime" },
    align: "center",
    width: 120,
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 120,
  },
  {
    title: " 车间",
    dataIndex: "WorkShopName",
    align: "center",
    width: 100,
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
    width: 100,
  },
  {
    title: "数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: "80px",
  },
  {
    title: "备注",
    dataIndex: "Remarks",
    scopedSlots: { customRender: "Remarks" },
    align: "center",
    width: "120px",
  },
];
import { setPrintInfo } from "@/services/web.js";
import print from "./components/print.vue";
import { splitData } from "@/utils/util.js";
export default {
  props: ["orderList", "userLineData"],
  components: { print },
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
    };
  },
  created() {
    this.getPrintList();
  },
  methods: {
    splitData,
    closeModal() {
      this.isPrint = false;
    },
    close() {
      this.$emit("closeModal");
    },
    getPrintList() {
      let parmas = [];
      this.orderList.map((item) => {
        parmas.push(item.Id);
      });
      setPrintInfo(parmas, "getmitemprint").then((res) => {
        if (res.data.success) {
          this.data = res.data.data;
          this.pagination.total = this.data.length;
        }
      });
    },
    handleOk() {
      if(this.pagination.total < 1 ){
        return
      }
      this.isPrint = true;
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
