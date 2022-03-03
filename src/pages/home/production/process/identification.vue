<!--
 * @Author: max
 * @Date: 2021-12-16 13:58:52
 * @LastEditTime: 2022-03-03 11:49:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/identification.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="打印标识卡" @cancel="close" :ok-button-props="{ props: { disabled: selectedRowKeys.length == 0 } }" okText="确认打印" @ok="handleOk" centered width="70%">
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
          <a-table
            :columns="columns"
            :data-source="data"
            :size="size"
            :pagination="false"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
          >
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
    <print v-if="isPrint" :printData="printData" @closeModal="closeModal" />
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
    dataIndex: "BusinessOrderNo",
    scopedSlots: { customRender: "BusinessOrderNo" },
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
    title: "工单数量",
    dataIndex: "MoQty",
    scopedSlots: { customRender: "MoQty" },
    align: "center",
    width: 80,
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
      selectedRowKeys: [],
      printData: [],
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
      this.printData = [];
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning("请先勾选要打印的工单!");
        return;
      }
      this.selectedRowKeys.map((item) => {
        this.printData.push(this.data[item]);
      });
      // this.printData.push({
      //   BatchNo: null,
      //   DateCreated: "2022-01-18T17:36:47.48",
      //   FinishedQty: null,
      //   HisScrapedQty: null,
      //   Id: "A4CD988A49EA4183A9E22DE6722369BB",
      //   InnerOrderNo: null,
      //   IsMitemIdentity: false,
      //   IsWrite: null,
      //   LineId: "5D135D85016942618B25F0FF5B7C12E0",
      //   LineName: "老化车间02线",
      //   MoCode: "WK-1911050064",
      //   MoQty: null,
      //   PerQty: null,
      //   PlanDate: "2022-01-06T00:00:00",
      //   PlanQty: 2000,
      //   PlantId: "EDC8B0D024BE4209BFB0BDB2BB0BCBEB",
      //   PlantName: "深圳民爆",
      //   PlantType: null,
      //   MitemName:"",
      //   ProCode: "3-03202-30300001",
      //   ProName: "UP-FDB30370-01 AL08-30W调光 TUV认证 SAA152451 SAA160864 for AL25",
      //   ProPlanId: "8CDD0749BBBB4A7C98D7DFBA40386A0E",
      //   ProcessCode: "AGEING_PROCESS",
      //   ProcessId: "71CA6E7BDD4849D5AAC05C91A05E3541",
      //   ProcessName: "老化工序",
      //   ProcessStatus: "PROCESS_FINISHED",
      //   ProcessStatusName: "老化工序工序出站",
      //   ProcessStep: null,
      //   Remarks: null,
      //   ReportQty: 4,
      //   SalesOrderNo: null,
      //   ScanCode: "WK-1911050064",
      //   ScanCodeType: null,
      //   ScrapedQty: 0,
      //   StartedQty: null,
      //   Status: null,
      //   StatusName: null,
      //   UserCode: "UP-10163",
      //   UserName: "曾辉",
      //   WorkshopId: "BADD9225C22342C4988B5CB1B40A9935",
      //   WorkshopName: "老化车间01",
      // });
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
