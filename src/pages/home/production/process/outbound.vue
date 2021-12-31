<!--
 * @Author: max
 * @Date: 2021-12-15 15:36:31
 * @LastEditTime: 2021-12-31 15:36:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/outbound.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="5" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-input style="width:400px" allowClear ref="orderValue" v-model.trim="orderValue" placeholder="" @change="inputChange" @pressEnter="scanCode" auto-size /></div>
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
        <a-descriptions-item label="出站数量"><a-input-number :min="0" v-model="receiveQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item label="报废数量"><a-input-number :min="0" v-model="scrapQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item label="备注"><a-input v-model="remark" style="width:200px"/></a-descriptions-item>
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
    <div style="margin:10px 0">
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <!-- 列表 -->
    <WorkTable :orderList="orderList" :tableType="2" @listUpdate="listUpdate" />
    <identification v-if="isPrint" :orderList="orderList" :userLineData="userLineData" @closeModal="closeModal"></identification>
    <orderSelect v-if="isOrderSelect" :userLineData="userLineData" :orderSelectList="orderSelectList" @closeModal="closeModal" @succeedOrder="succeedOrder" :selectType="selectType" />
  </a-card>
</template>
<script>
import { setStartWorkApi } from "@/services/web.js";
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
      console.log("1111");
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
        ScanCode: this.orderValue.trim(),
        ProcessStatus: "PROCESS_FINISHED",
      };
      setStartWorkApi(parmas, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          this.receiveQty = 0;
          this.scrapQty = 0;
          this.remark = "";
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            this.selectType = res.data.data.result.selectType;
            this.isOrderSelect = true;
            let result = res.data.data.result.result;
            result.map((item) => {
              item.ReportQty = 0;
              item.ScrapedQty = 0;
            });
            this.orderSelectList = result;
            // if (res.data.data.result.selectType == "single") {
            //   this.orderInfo = res.data.data.result.result[0];
            //   this.getHistoryList();
            // } else {
            //   this.isOrderSelect = true;
            //   let result = res.data.data.result.result;
            //   result.map((item) => {
            //     item.ReportQty = 0;
            //     item.ScrapedQty = 0;
            //   });
            //   this.orderSelectList = result;
            // }
            this.listData.unshift(res.data.message);
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    getHistoryList() {
      let parmas = {
        ProPlanId: this.orderInfo.ProPlanId,
        MoCode: this.orderInfo.MoCode,
        ProcessStatus: "PROCESS_FINISHED",
      };
      this.orderList = [];
      setStartWorkApi(parmas, "gethisreports").then((res) => {
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
          content: "请先输入出站数量",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      let parmas = [];
      let url = "";
      if (this.selectType == "Multiple") {
        url = "multiplesubmit";
        this.multipleList.forEach((item) => {
          parmas.push({
            ProPlanId: item.ProPlanId,
            PlantId: item.PlantId,
            WorkshopId: item.WorkshopId,
            LineId: item.LineId,
            ScanCode: item.ScanCode,
            ScanCodeType: item.ScanCodeType,
            MoCode: item.MoCode,
            ProcessStatus: "PROCESS_FINISHED",
            ReportQty: item.ReportQty,
            ScrapedQty: item.ScrapedQty,
          });
        });
      } else {
        url = "submit";
        parmas = {
          ProPlanId: this.orderInfo.ProPlanId,
          PlantId: this.orderInfo.PlantId,
          WorkshopId: this.orderInfo.WorkshopId,
          LineId: this.orderInfo.LineId,
          ScanCode: this.orderInfo.ScanCode,
          ScanCodeType: this.orderInfo.ScanCodeType,
          MoCode: this.orderInfo.MoCode,
          ProcessStatus: "PROCESS_FINISHED",
          ReportQty: this.receiveQty,
          ScrapedQty: this.scrapQty,
        };
      }
      setStartWorkApi(parmas, url).then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            let list = res.data.data.result;
            list.map((item) => {
              this.orderList.unshift(item);
            });
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
      let parmas = {
        Id: item.Id,
        ReportQty: item.ReportQty,
        ScrapedQty: item.ScrapedQty,
        ProcessStatus: "PROCESS_FINISHED",
      };
      setStartWorkApi(parmas, "update").then((res) => {
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
