<!--
 * @Author: max
 * @Date: 2021-12-11 09:42:18
 * @LastEditTime: 2023-08-10 09:40:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/qrcode/codePrint.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="5" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-input style="width:400px;" allowClear ref="orderValue1" v-model.trim="orderValue" placeholder="" @change="inputChange" @blur="inputBlur()" @pressEnter="scanCode" auto-size /></div>
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂/车间/产线" :span="2"> {{ orderInfo.PlantName }}/{{ orderInfo.WorkshopName }}/ {{ orderInfo.LineName }} </a-descriptions-item>
        <a-descriptions-item label="填单人/填单时间"> {{ userLineData.UserName }} / {{ splitData(userLineData.NowDate) }} </a-descriptions-item>
        <a-descriptions-item label="产品品号">{{ orderInfo.ProCode }}</a-descriptions-item>
        <a-descriptions-item label="产品品名">{{ orderInfo.ProName }}</a-descriptions-item>
        <a-descriptions-item label="开工时间">{{ orderInfo.DateCreated }}</a-descriptions-item>
        <a-descriptions-item label="完工时间">{{ orderInfo.DateCreated }}</a-descriptions-item>
        <a-descriptions-item label="完工数量/工单数量">{{ orderInfo.FinishedQty }}/{{ orderInfo.MoQty }}</a-descriptions-item>
        <!-- <a-descriptions-item> -->
      </a-descriptions>
      <!-- <a-button type="primary" icon="printer" @click="printBtn" :disabled="!isStart">
        打印产品追溯码
      </a-button>
      <a-button style="margin-left:10px" type="primary" icon="printer" @click="printBtn('Y')" :disabled="!isStart">
        补打产品追溯码
      </a-button> -->
      <a-button type="primary" icon="printer" :disabled="!isStart" @click="printBtn('')">打印产品追溯码</a-button>
      <a-button type="primary" style="margin-left:10px" icon="printer" :disabled="!isStart" @click="printBtn('Y')">补打产品追溯码</a-button>
    </a-card>
    <div>
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <WorkTable :orderList="orderList" :tableType="2" />
    <!-- 列表 -->
    <PrintList v-if="isPrintList" :IsRePrint="IsRePrint" :orderInfo="orderInfo" @success="setPrint" @closeModal="closeModal" />
    <print v-if="isPrint" :printData="printData" :IsRePrint="IsRePrint" :printList="printList" @closeModal="closeModal" />
  </a-card>
</template>
<script>
import { getQrCode } from "@/services/mes.js";
import { getTemplate } from "@/services/web.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { getTimeData } from "@/utils/util";
import MsgList from "../components/MsgList.vue";
import WorkTable from "../components/WorkTable.vue";
import { splitData } from "@/utils/util.js";
import PrintList from "./printList.vue";
import Print from "./print.vue";
export default {
  components: { MsgList, WorkTable, PrintList, Print },
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
      peopleQty: 0,
      isFocus: false,
      ColorTemperature: "",
      remark: "",
      isBatching: false,
      isPrintList: false,
      printList: [],
      IsRePrint: "",
    };
  },
  created() {
    this.getWorkInfo();
  },
  mounted() {
    this.$refs.orderValue1.focus();
  },
  methods: {
    splitData,
    startBatching() {
      this.isBatching = true;
    },
    printBtn(isRe) {
      console.log("IsRePrint===", this.IsRePrint);
      console.log("isRe===", isRe);
      this.isPrintList = true;
      this.IsRePrint = isRe;
    },
    setPrint(list) {
      this.isPrintList = false;
      console.log("list=====", list);
      if (list.length == 0) {
        return;
      }
      let params = {
        tempcode: "PS_PRINTER_TEMP",
      };
      getTemplate(params).then((res) => {
        if (res.data.success) {
          this.$emit("closeModal");
          this.isPrint = true;
          this.printData = res.data.data;
          this.printList = list;
        }
      });
    },
    inputBlur() {
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue1.focus();
        }, 10000);
      }
    },
    setFocus() {
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue1.focus();
        }, 100);
      }
    },
    //定时添加焦点
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
      this.startWorkQty = 0;
      this.peopleQty = 0;
      this.remark = "";
    },
    closeModal() {
      this.isPrintList = false;
      this.isOrderSelect = false;
      this.isPrint = false;
    },
    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    getWorkInfo() {
      getQrCode("", "loaduserline").then((res) => {
        if (res.data.success) {
          res.data.message.time = getTimeData();
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.processData = res.data.data.result.Process;
            this.userLineData = { ...res.data.data.result.UserLine, ...this.processData };
            console.log("this.userLineData ===", this.userLineData);
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
      this.orderInfo = [];
      this.orderList = [];
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
        ProcessStatus: "PROCESS_START",
        MoCode: this.orderValue,
        LineId: this.userLineData.LineId,
      };
      getQrCode(params, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            this.orderInfo = res.data.data.result.Scan;
            this.orderList = res.data.data.result.QrPrintList;
            console.log("this.orderList==", this.orderList);
            // if (res.data.data.result.selectType == "single") {
            //   this.orderInfo = res.data.data.result.Scan
            //   // this.getHistoryList();
            // } else {
            //   this.isOrderSelect = true;
            //   this.orderSelectList = res.data.data.result.Scan;
            // }
            this.listData.unshift(res.data.message);
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
            this.isStart =false;
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
      let params = {
        ProPlanId: this.orderInfo.ProPlanId,
        MoCode: this.orderInfo.MoCode,
        ProcessStatus: "PROCESS_START",
      };
      this.orderList = [];
      getQrCode(params, "gethisreports").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            let list = res.data.data.result;
            if (this.selectType == "single") {
              this.orderList.unshift(list);
            } else {
              list.map((item) => {
                this.orderList.unshift(item);
              });
            }
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
      let params = {
        LineId: this.orderInfo.LineId,
        ScanCode: this.orderInfo.ScanCode,
        ScanCodeType: this.orderInfo.ScanCodeType,
        MoCode: this.orderInfo.MoCode,
        ProcessStatus: "PROCESS_START",
        ReportQty: this.startWorkQty,
        PerQty: this.peopleQty,
        Remarks: this.remark,
      };
      getQrCode(params, "submit").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            this.orderList = res.data.data.result.Reports;
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
