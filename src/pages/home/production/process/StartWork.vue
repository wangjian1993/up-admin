<!--
 * @Author: max
 * @Date: 2021-12-11 09:42:18
 * @LastEditTime: 2021-12-25 09:07:53
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/StartWork.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="5" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-input style="width:400px;" allowClear ref="orderValue" v-model.trim="orderValue" placeholder="" @change="inputChange" @pressEnter="scanCode" auto-size /></div>
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
        <a-descriptions-item label="填单人/填单时间">
          {{ userLineData.UserName }}
        </a-descriptions-item>
        <a-descriptions-item label="产品品号">{{ orderInfo.ProCode }}</a-descriptions-item>
        <a-descriptions-item label="产品品名">{{ orderInfo.ProName }}</a-descriptions-item>
        <a-descriptions-item label="计划生产时间">{{ splitData(orderInfo.PlanDate) }}</a-descriptions-item>
        <a-descriptions-item label="计划生产数量">{{ orderInfo.PlanQty }}</a-descriptions-item>
        <a-descriptions-item label="开工数量"><a-input-number :min="0" v-model="startWorkQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item>
          <a-button type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            开工
          </a-button>
          <a-button style="margin-left:10px" type="primary" :disabled="!isStart" icon="export" @click="handlePrint()">
            打印工单
          </a-button></a-descriptions-item
        >
      </a-descriptions>
    </a-card>
    <div style="margin:10px 0">
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <WorkTable :orderList="orderList" :tableType="0"/>
    <!-- 列表 -->
    <print v-if="isPrint" :printData="printData" @closeModal="closeModal"></print>
    <orderSelect v-if="isOrderSelect" :userLineData="userLineData" :orderSelectList="orderSelectList" @closeModal="closeModal" @succeedOrder="succeedOrder" />
  </a-card>
</template>
<script>
import { setStartWorkApi, getPrintInfo } from "@/services/web.js";
import { PublicVar } from "@/mixins/publicVar.js";
import Print from "../components/print.vue";
import { getTimeData } from "@/utils/util";
import MsgList from "../components/MsgList.vue";
import WorkTable from "../components/WorkTable.vue";
import orderSelect from "./components/orderSelect.vue";
import { splitData } from "@/utils/util.js";
export default {
  components: { Print, MsgList, WorkTable, orderSelect },
  mixins: [PublicVar],
  data() {
    return {
      listData: [],
      processData: [],
      userLineData: [],
      orderValue: "",
      loading: false,
      orderInfo: [],
      printData: [],
      isPrint: false,
      IsSuccess: false,
      startWorkQty: 0,
      orderList: [],
      isOrderSelect: false,
      orderSelectList: [],
      isStart: false,
    };
  },
  created() {
    this.getWorkInfo();
  },
  mounted() {
    this.$refs.orderValue.focus();
  },
  methods: {
    splitData,
    closeListData() {
      this.listData = [];
    },
    inputChange(e) {
      const { value } = e.target;
      if (!value && e.type !== "change") {
        // do something
        this.emptyData();
      }
    },
    emptyData() {
      // this.orderInfo = [];
      // this.processData = [];
      // this.userLineData = [];
      this.orderValue = "";
      this.startWorkQty = 0;
    },
    closeModal() {
      this.isPrint = false;
      this.isOrderSelect = false;
    },
    //打印工单
    handlePrint() {
      console.log(this.orderInfo);
      if (this.orderInfo.length == 0) {
        let message = {
          content: "请先输入工单号，或者扫描工单二维码",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      let parmas = {
        id: this.orderInfo.ProPlanId,
      };
      getPrintInfo(parmas, "getprintinfo").then((res) => {
        if (res.data.success) {
          this.isPrint = true;
          this.printData = res.data.data;
        }
      });
    },
    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    getWorkInfo() {
      setStartWorkApi("", "loaduserline").then((res) => {
        if (res.data.success) {
          res.data.message.time = getTimeData();
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.processData = res.data.data.result.Process;
            this.userLineData = { ...res.data.data.result.UserLine, ...this.processData };
          }
          res.data.message.content = res.data.data.Msg;
          this.listData.unshift(res.data.message);
        }
      });
    },
    //扫码
    scanCode(e) {
      if (e.keyCode == 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
      }
      if (!this.orderValue) {
        let message = {
          content: "请先输入工单号，或者扫描工单二维码",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      let parmas = {
        ScanCode: this.orderValue,
        ProcessCode: "ASSEMBLE_PROCESS",
        ProcessStatus: "PROCESS_START",
      };
      setStartWorkApi(parmas, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            if (res.data.data.result.length == 1) {
              this.orderInfo = res.data.data.result[0];
              this.getHistoryList();
            } else {
              this.isOrderSelect = true;
              this.orderSelectList = res.data.data.result;
            }
            this.listData.unshift(res.data.message);
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    succeedOrder(item) {
      this.orderInfo = item;
      this.isOrderSelect = false;
      this.getHistoryList();
    },
    getHistoryList() {
      let parmas = {
        ProPlanId: this.orderInfo.ProPlanId,
        MoCode: this.orderInfo.MoCode,
        ProcessStatus: "PROCESS_START",
      };
      setStartWorkApi(parmas, "gethisreports").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            this.orderList = res.data.data.result;
            this.listData.unshift(res.data.message);
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    //开工
    startWork() {
      if (!this.orderValue) {
        let message = {
          content: "请先输入工单号，或者扫描工单二维码",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      if (!this.startWorkQty) {
        let message = {
          content: "请先输入开工数量",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      let parmas = {
        ProPlanId: this.orderInfo.ProPlanId,
        PlantId: this.orderInfo.PlantId,
        WorkshopId: this.orderInfo.WorkshopId,
        LineId: this.orderInfo.LineId,
        ScanCode: this.orderInfo.ScanCode,
        ScanCodeType: this.orderInfo.ScanCodeType,
        MoCode: this.orderInfo.MoCode,
        ProcessCode: "ASSEMBLE_PROCESS",
        ProcessStatus: "PROCESS_START",
        ReportQty: this.startWorkQty,
        ScrapedQty: 0,
      };
      setStartWorkApi(parmas, "submit").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            this.orderList.unshift(res.data.data.result);
            this.listData.unshift(res.data.message);
            this.emptyData();
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  min-height: 71vh;
  max-height: 71vh;
  overflow: auto;
}
/deep/ .ant-list-sm .ant-list-item {
  padding-top: 2px;
  padding-bottom: 2px;
}
/deep/ .ant-list-split .ant-list-item {
  border-bottom: none;
}
/deep/ .ant-list {
  font-size: 10px;
}
</style>
