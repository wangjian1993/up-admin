<!--
 * @Author: max
 * @Date: 2021-12-11 09:42:18
 * @LastEditTime: 2022-11-15 09:49:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/process/pullIn.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="5" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-input style="width:400px;" allowClear ref="orderValue1" v-model.trim="orderValue" placeholder="" @change="inputChange" @blur="inputBlur()" @pressEnter="scanCode" auto-size /></div>
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂/车间/产线" :span="2"> {{ userLineData.PlantName }}/{{ userLineData.WorkshopName }}/ {{ userLineData.LineName }} </a-descriptions-item>
        <a-descriptions-item label="填单人/填单时间"> {{ userLineData.UserName }} / {{ splitData(userLineData.NowDate) }} </a-descriptions-item>
        <a-descriptions-item label="产品品号">{{ orderInfo.ProCode }}</a-descriptions-item>
        <a-descriptions-item label="产品品名" :span="2">{{ orderInfo.ProName }}</a-descriptions-item>
        <a-descriptions-item label="开工时间">{{ orderInfo.DateCreated }}</a-descriptions-item>
        <a-descriptions-item label="工单数量">{{ orderInfo.MoQty }}</a-descriptions-item>
        <a-descriptions-item label="开工数量"><a-input-number @blur="setFocus()" :min="0" v-model="startWorkQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item label="备注"><a-input @blur="setFocus" v-model="remark" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item>
          <a-button type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            进站
          </a-button>
          <a-button style="margin-left:10px" type="primary" icon="check-circle" @click="startBatching" :disabled="!isStart">
            投料
          </a-button></a-descriptions-item
        >
      </a-descriptions>
    </a-card>
    <div>
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <WorkTable :orderList="orderList" :tableType="0" />
    <!-- 列表 -->
    <orderSelect v-if="isOrderSelect" :userLineData="userLineData" :orderSelectList="orderSelectList" @closeModal="closeModal" @succeedOrder="succeedOrder" />
    <Batching v-if="isBatching" :orderInfo="orderInfo" @closeModal="closeModal" />
  </a-card>
</template>
<script>
import { getProcessReport } from "@/services/mes.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { getTimeData } from "@/utils/util";
import MsgList from "../components/MsgList.vue";
import WorkTable from "../components/WorkTable.vue";
import orderSelect from "./components/orderSelect.vue";
import { splitData } from "@/utils/util.js";
import Batching from "./components/batching.vue";
export default {
  components: { MsgList, WorkTable, orderSelect, Batching },
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
      this.isPrint = false;
      this.isOrderSelect = false;
      this.isBatching = false
    },
    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    getWorkInfo() {
      getProcessReport("", "loaduserline").then((res) => {
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
      getProcessReport(params, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            this.orderInfo = res.data.data.result.Scan;
            this.orderList = res.data.data.result.Reports;
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
      getProcessReport(params, "gethisreports").then((res) => {
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
        Remarks: this.Remarks,
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
