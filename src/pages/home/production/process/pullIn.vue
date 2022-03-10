<!--
 * @Author: max
 * @Date: 2021-12-15 15:36:17
 * @LastEditTime: 2022-03-10 14:02:17
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/pullIn.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="5" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-input style="width:400px" allowClear ref="orderValue2" v-model.trim="orderValue" placeholder="" @change="inputChange" @blur="inputBlur" @pressEnter="scanCode" auto-size /></div>
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
        <a-descriptions-item label="计划生产时间">{{ splitData(orderInfo.PlanDate) }}</a-descriptions-item>
        <a-descriptions-item label="计划生产数量">{{ orderInfo.PlanQty }}</a-descriptions-item>
        <a-descriptions-item label="接收数量"><a-input-number @blur="setFocus" :min="0" v-model="receiveQty" :disabled="orderInfo.IsWrite === false" style="width:200px"/></a-descriptions-item>
        <!-- <a-descriptions-item label="报废数量"><a-input-number :min="0" v-model="scrapQty" style="width:200px"/></a-descriptions-item> -->
        <a-descriptions-item :span="2" label="备注"><a-input @blur="setFocus" v-model="remark" style="width:500px"/></a-descriptions-item>
        <a-descriptions-item>
          <a-button v-if="hasPerm('process_scan')" type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            进站
          </a-button>
          <a-button v-else type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            进站
          </a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div style="margin:10px 0">
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <!-- 列表 -->
    <WorkTable :orderList="orderList" :tableType="1" />
    <orderSelectPull v-if="isOrderSelect" :userLineData="userLineData" :orderSelectList="orderSelectList" @closeModal="closeModal" @succeedOrder="succeedOrder" :selectType="selectType" />
  </a-card>
</template>
<script>
import { setStartWorkApi } from "@/services/web.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { getTimeData } from "@/utils/util";
import MsgList from "../components/MsgList.vue";
import WorkTable from "../components/WorkTable.vue";
import orderSelectPull from "./components/orderSelectPull.vue";
import { splitData } from "@/utils/util.js";
export default {
  components: { MsgList, WorkTable, orderSelectPull },
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
      isFocus: false,
    };
  },
  created() {
    this.getWorkInfo();
  },
  mounted() {
    this.$refs.orderValue2.focus();
  },
  methods: {
    splitData,
    closeListData() {
      this.listData = [];
    },
    inputBlur() {      
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue2.focus();
        }, 10000);
      }
    },
    setFocus() {
      if (!this.isFocus) {
        setTimeout(() => {
          console.log("111111====", this.$refs.orderValue2);
          this.$refs.orderValue2.focus();
        }, 100);
      }
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
      this.receiveQty = 0;
      this.isStart = false;
      this.remark = "";
      this.orderInfo.IsWrite = true;
    },
    //打印工单
    //打印工单
    handlePrint() {
      if (this.orderInfo.length == 0) {
        let message = {
          content: "请先输入工单号，或者扫描工单二维码",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      console.log("打印", this.userLineData);
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
      let parmas = {
        ScanCode: this.orderValue.trim(),
        ProcessStatus: "PROCESS_START",
      };
      setStartWorkApi(parmas, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          this.receiveQty = 0;
          this.remark = "";
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            this.selectType = res.data.data.result.selectType;
            let result = res.data.data.result.result;
            if (result.length <= 1) {
              this.orderInfo = res.data.data.result.result[0];
              this.getHistoryList();
              if (this.orderInfo.IsWrite === false) {
                this.receiveQty = this.orderInfo.ReportQty;
              }
            } else {
              this.isOrderSelect = true;
              result.map((item) => {
                item.receiveQty = 0;
              });
              this.orderSelectList = result;
            }

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
        ProcessStatus: "PROCESS_START",
      };
      this.orderList = [];
      setStartWorkApi(parmas, "gethisreports").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            let list = res.data.data.result;
            if (list.length == 0) {
              return;
            }
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
        this.receiveQty += item.receiveQty;
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
      if (this.receiveQty <= 0) {
        let message = {
          content: "进站数量必须大于0",
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
        ProcessStatus: "PROCESS_START",
        ReportQty: this.receiveQty,
        ScrapedQty: 0,
      };
      setStartWorkApi(parmas, "submit").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          console.log(res);
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
