<!--
 * @Author: max
 * @Date: 2021-12-15 15:36:31
 * @LastEditTime: 2022-11-15 09:50:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/process/outbound.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="6" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-input style="width:400px" allowClear ref="orderValue3" v-model.trim="orderValue" placeholder="" @change="inputChange" @blur="inputBlur" @pressEnter="scanCode" auto-size /></div>
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
        <a-descriptions-item label="填单人/填单时间"> {{ userLineData.UserName }} / {{ splitData(userLineData.NowDate) }} </a-descriptions-item>
        <a-descriptions-item label="产品品号">{{ orderInfo.ProCode }}</a-descriptions-item>
        <a-descriptions-item label="产品品名">{{ orderInfo.ProName }}</a-descriptions-item>
        <a-descriptions-item label="开工时间">{{ splitData(orderInfo.DatetimeStart) }}</a-descriptions-item>
        <a-descriptions-item label="已完工/工单数量">{{ orderInfo.FinishedQty }}/{{ orderInfo.MoQty }}</a-descriptions-item>
        <a-descriptions-item label="不良数量">{{ orderInfo.ScrapedQty }}</a-descriptions-item>
        <a-descriptions-item label="当前工序">{{ orderInfo.ProcessName }}</a-descriptions-item>
        <a-descriptions-item label="完工数量"><a-input-number @blur="setFocus" :min="0" v-model="receiveQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item label="不良数量"><a-input-number @blur="setFocus" :min="0" v-model="scrapQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item label="备注"><a-input @blur="setFocus" v-model="remark" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item>
          <a-button v-if="hasPerm('process_scan')" type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            出站
          </a-button>
          <a-button v-else type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            出站
          </a-button>
          <a-button style="margin-left:10px" type="primary" icon="export" :disabled="!isStart" @click="handlePrint()">
            打印标识卡
          </a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div>
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <WorkTable :orderList="orderList" :tableType="1" />
    <identification v-if="isPrint" :orderList="orderList" :userLineData="userLineData" @closeModal="closeModal"></identification>
    <orderSelect v-if="isOrderSelect" :userLineData="userLineData" :orderSelectList="orderSelectList" @closeModal="closeModal" @succeedOrder="succeedOrder" :selectType="selectType" />
  </a-card>
</template>
<script>
import { getProcessReport } from "@/services/mes.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { getTimeData } from "@/utils/util";
import MsgList from "../components/MsgList.vue";
import WorkTable from "../components/WorkTable.vue";
import identification from "./identification.vue";
import orderSelect from "./components/orderSelect.vue";
import { splitData } from "@/utils/util.js";
export default {
  components: { identification, MsgList, WorkTable, orderSelect },
  mixins: [PublicVar],
  data() {
    return {
      listData: [],
      processData: [],
      userLineData: [],
      orderValue: "",
      orderInfo: [],
      printData: [],
      isPrint: false,
      IsSuccess: false,
      remark: "",
      receiveQty: 0,
      scrapQty: 0,
      orderList: [],
      isOrderSelect: false,
      orderSelectList: [],
      isStart: false,
      selectType: "",
      multipleList: [],
      isFocus: false,
    };
  },
  created() {
    this.getWorkInfo();
  },
  mounted() {
    this.$refs.orderValue3.focus();
  },
  methods: {
    splitData,
    inputBlur() {
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue3.focus();
        }, 10000);
      }
    },
    setFocus() {
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue3.focus();
        }, 100);
      }
    },
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
      this.orderValue = "";
      this.receiveQty = 0;
      this.scrapQty = 0;
      this.remark = "";
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
      this.isPrint = true;
    },

    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    closeModal() {
      this.visible = false;
      this.isPrint = false;
      this.isOrderSelect = false;
    },
    getWorkInfo() {
      getProcessReport("", "loaduserline").then((res) => {
        if (res.data.success) {
          res.data.message.time = getTimeData();
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.processData = res.data.data.result.Process;
            this.userLineData = { ...res.data.data.result.UserLine, ...this.processData };
            this.isFocus = true;
          } else {
            this.isFocus = false;
          }
          res.data.message.content = res.data.data.Msg;
          this.listData.unshift(res.data.message);
        }
      });
    },
    //扫码
    scanCode(e) {
      e.currentTarget.select();
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
      let params = {
        ScanCode: this.orderValue,
        ProcessStatus: "PROCESS_FINISHED",
        MoCode: this.orderValue,
        LineId: this.userLineData.LineId,
      };
      getProcessReport(params, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          this.receiveQty = 0;
          this.scrapQty = 0;
          this.remark = "";
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            this.orderInfo = res.data.data.result.Scan;
            this.orderList = res.data.data.result.Reports;
            console.log("this.orderList==", this.orderList);
            this.listData.unshift(res.data.message);
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    getHistoryList() {
      let params = {
        ProPlanId: this.orderInfo.ProPlanId,
        MoCode: this.orderInfo.MoCode,
        ProcessStatus: "PROCESS_FINISHED",
      };
      this.orderList = [];
      getProcessReport(params, "gethisreports").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            let list = res.data.data.result;
            list.map((item) => {
              this.orderList.unshift(item);
            });
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    succeedOrder(list) {
      console.log(list);
      this.multipleList = list;
      list.forEach((item) => {
        this.receiveQty += item.ReportQty;
        this.scrapQty += item.ScrapedQty;
      });
      this.orderInfo = list[0];
      this.isOrderSelect = false;
      this.getHistoryList();
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
      if (!this.receiveQty) {
        let message = {
          content: "请先输入完工数量",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      let params = {
        LineId: this.orderInfo.LineId,
        ScanCode: this.orderInfo.ScanCode,
        ScanCodeType: this.orderInfo.ScanCodeType,
        MoCode: this.orderInfo.MoCode,
        ProcessStatus: "PROCESS_FINISHED",
        ReportQty: this.receiveQty,
        ScrapedQty: this.scrapQty,
        PerQty:0,
        Remarks: this.remark,
      };
      getProcessReport(params, "submit").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            this.orderList =res.data.data.result.Reports;
            this.listData.unshift(res.data.message);
            this.emptyData();
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    listUpdate(item) {
      let params = {
        Id: item.Id,
        ReportQty: item.ReportQty,
        ScrapedQty: item.ScrapedQty,
        ProcessStatus: "PROCESS_FINISHED",
      };
      getProcessReport(params, "update").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.data.IsSuccess) {
          res.data.message.content = res.data.data.Msg;
          this.listData.unshift(res.data.message);
        } else {
          res.data.message.content = res.data.data.Msg;
          this.listData.unshift(res.data.message);
        }
        this.getHistoryList();
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
