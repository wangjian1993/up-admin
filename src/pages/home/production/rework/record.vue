<!--
 * @Author: max
 * @Date: 2021-12-17 09:09:51
 * @LastEditTime: 2022-03-10 13:54:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/rework/record.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="5" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-input style="width:400px" allowClear ref="orderValue" v-model.trim="orderValue" placeholder="" @pressEnter="scanCode" @blur="inputBlur" auto-size /></div>
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂">
          {{ userLineData.PlantName }}
        </a-descriptions-item>
        <a-descriptions-item label="返工车间">
          <a-select style="width: 200px" v-model="ReworkWorkshopId" placeholder="请选择返工车间" @change="workshopChange">
            <a-select-option v-for="item in workshopList" :key="item.WorkshopId" :value="item.WorkshopId">{{ item.WorkshopName }}</a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="返工产线">
          <a-select style="width: 200px" v-model="ReworkLineId" placeholder="请选择返工产线">
            <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="填单人/填单时间"> {{ userLineData.UserName }} / {{ splitData(userLineData.NowDate) }} </a-descriptions-item>
        <a-descriptions-item label="产品品号">{{ orderInfo.ProCode }}</a-descriptions-item>
        <a-descriptions-item label="产品品名">{{ orderInfo.ProName }}</a-descriptions-item>
        <a-descriptions-item label="计划生产时间">{{ orderInfo.PlanDate }}</a-descriptions-item>
        <a-descriptions-item label="计划生产数量">{{ orderInfo.PlanQty }}</a-descriptions-item>
        <a-descriptions-item label="返工数量"><a-input-number @blur="setFocus" :disabled="isOrderDisabled" :min="0" v-model="reworkQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item label="返工原因"><a-input @blur="setFocus" v-model="remark" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item>
          <a-button v-if="hasPerm('save')" type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            返工提交
          </a-button>
          <a-button v-else type="primary" icon="check-circle" @click="startWork" :disabled="!isStart">
            返工提交
          </a-button>
          <a-button style="margin-left:10px" type="primary" icon="export" @click="handlePrint()" :disabled="!isStart">
            打印标识卡
          </a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div style="margin:10px 0">
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <!-- 列表 -->
    <WorkTable :orderList="orderList" :tableType="3" />
    <reworkSheet v-if="isPrint" :orderList="orderList" :userLineData="userLineData" @closeModal="closeModal"></reworkSheet>
    <orderSelect v-if="isOrderSelect" :userLineData="userLineData" :orderSelectList="orderSelectList" @closeModal="closeModal" @succeedOrder="succeedOrder" />
  </a-card>
</template>
<script>
import { setReworkApi, getReworkApi } from "@/services/web.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { getTimeData } from "@/utils/util";
import MsgList from "../components/MsgList.vue";
import WorkTable from "../components/WorkTable.vue";
import reworkSheet from "./reworkSheet.vue";
import orderSelect from "./components/orderSelect.vue";
import { splitData } from "@/utils/util.js";
export default {
  components: { MsgList, WorkTable, reworkSheet, orderSelect },
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
      reworkQty: 0,
      orderList: [],
      workshopList: [],
      workshopId: "",
      lineList: [],
      ReworkWorkshopId: "",
      ReworkLineId: "",
      isOrderSelect: false,
      orderSelectList: [],
      isOrderDisabled: false,
      reworkList: [],
      isStart: false,
      isFocus: false,
    };
  },
  created() {
    this.getWorkInfo();
    this.getWorkshopList();
  },
  mounted() {
    this.$refs.orderValue.focus();
  },
  activated() {
    setTimeout(() => {
      this.$refs.orderValue.focus();
    }, 100);
  },
  methods: {
    splitData,
    inputBlur() {
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue.focus();
        }, 10000);
      }
    },
    setFocus() {
      if (!this.isFocus) {
        setTimeout(() => {
          this.$refs.orderValue.focus();
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
      // this.orderInfo = [];
      // this.processData = [];
      // this.userLineData = [];
      this.orderValue = "";
      this.reworkQty = 0;
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
    getWorkshopList() {
      getReworkApi("", "getworkshop").then((res) => {
        if (res.data.success) {
          console.log(res.data.data.result);
          this.workshopList = res.data.data.result;
        }
      });
    },
    getLineList() {
      let parmas = {
        workshopid: this.workshopId,
      };
      getReworkApi(parmas, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data.result;
        }
      });
    },
    workshopChange(e) {
      this.workshopId = e;
      this.getLineList();
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
      setReworkApi("", "loaduserline").then((res) => {
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
        ScanCode: this.orderValue,
        ProcessStatus: "PROCESS_REWORK",
      };
      setReworkApi(parmas, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          this.reworkQty = 0;
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            if (res.data.data.result.length == 1) {
              this.orderInfo = res.data.data.result[0];
              this.reworkList = res.data.data.result;
              console.log(this.reworkList);
              this.isOrderDisabled = false;
            } else {
              this.isOrderSelect = true;
              this.isOrderDisabled = true;
              let result = res.data.data.result;
              result.map((item) => {
                item.reworkQty = 0;
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
    succeedOrder(list) {
      this.reworkList = list;
      list.forEach((item) => {
        let date = new Date(item.PlanDate);
        item.date = date.getTime();
        this.reworkQty += Number(item.reworkQty);
      });
      list.sort(this.orderSort);
      this.orderInfo = list[0];
      this.isOrderSelect = false;
    },
    orderSort(a, b) {
      return a.date - b.date;
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
      if (!this.reworkQty) {
        let message = {
          content: "请先输入进站数量",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      if (this.ReworkWorkshopId === "") {
        let message = {
          content: "请先选择返工生产车间",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      if (this.ReworkLineId === "") {
        let message = {
          content: "请先选择返工生产产线",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      let parmas = [];
      this.reworkList.map((item) => {
        parmas.push({
          ProPlanId: item.ProPlanId,
          ReworkWorkshopId: this.ReworkWorkshopId,
          ReworkLineId: this.ReworkLineId,
          ReworkQty: item.reworkQty || this.reworkQty,
          Remarks: this.remark,
          MoCode: item.MoCode,
          ScanCode: item.ScanCode,
          ScanCodeType: item.ScanCodeType,
        });
      });
      setReworkApi(parmas, "submit").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            res.data.data.result.map((item) => {
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
