<!--
 * @Author: max
 * @Date: 2021-12-17 09:09:51
 * @LastEditTime: 2021-12-17 16:46:03
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
          <div style="display:flex"><a-textarea style="width:400px" allowClear ref="orderValue" v-model.trim="orderValue" placeholder="" @pressEnter="scanCode" auto-size /></div>
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂">
          {{ userLineData.PlantName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产车间">
          <a-select style="width: 200px" v-model="ReworkWorkshopId" placeholder="请选择生产车间" @change="workshopChange">
            <a-select-option v-for="item in workshopList" :key="item.WorkshopId" :value="item.WorkshopId">{{ item.WorkshopName }}</a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="生产产线">
          <a-select style="width: 200px" v-model="ReworkLineId" placeholder="请选择生产产线">
            <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="填单人/填单时间">
          {{ userLineData.UserName }}
        </a-descriptions-item>
        <a-descriptions-item label="产品品号">{{ orderInfo.ProCode }}</a-descriptions-item>
        <a-descriptions-item label="产品品名">{{ orderInfo.ProName }}</a-descriptions-item>
        <a-descriptions-item label="计划生产时间">{{ orderInfo.PlanDate }}</a-descriptions-item>
        <a-descriptions-item label="计划生产数量">{{ orderInfo.PlanQty }}</a-descriptions-item>
        <a-descriptions-item label="返工数量"><a-input-number :min="0" v-model="reworkQty" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item label="返工原因"><a-input v-model="remark" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item>
          <a-button type="primary" icon="check-circle" @click="startWork" :disabled="!hasPerm('save')">
            返工提交
          </a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div style="margin:10px 0">
      <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
    </div>
    <!-- 列表 -->
    <WorkTable :orderList="orderList" />
    <identification v-if="isPrint" :orderList="orderList" :userLineData="userLineData" @closeModal="closeModal"></identification>
  </a-card>
</template>
<script>
import { setReworkApi, getReworkApi } from "@/services/web.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { getTimeData } from "@/utils/util";
import MsgList from "../components/MsgList.vue";
import WorkTable from "../components/WorkTable.vue";
import identification from "../process/identification.vue";
export default {
  components: { MsgList, WorkTable, identification },
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
    };
  },
  created() {
    this.getWorkInfo();
    this.getWorkshopList();
  },
  mounted() {
    this.$refs.orderValue.focus();
  },
  methods: {
    closeListData() {
      this.listData = [];
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
    },
    getWorkInfo() {
      setReworkApi("", "loaduserline").then((res) => {
        if (res.data.success) {
          res.data.message.time = getTimeData();
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.processData = res.data.data.result.Process;
            this.userLineData = res.data.data.result.UserLine;
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
        ProcessStatus: "PROCESS_REWORK",
      };
      setReworkApi(parmas, "scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            this.orderInfo = res.data.data.result;
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
      let parmas = {
        ReworkWorkshopId: this.ReworkWorkshopId,
        ReworkLineId: this.ReworkLineId,
        ReworkQty: this.reworkQty,
        Remarks: this.remark,
        ScanCodeType: this.orderInfo.ScanCodeType,
        MoCode: this.orderInfo.MoCode,
        ScanCode: this.orderInfo.ScanCode,
      };
      setReworkApi(parmas, "submit").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          console.log(res);
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = res.data.data.Msg;
            this.orderList.unshift(res.data.data.result);
            this.listData.unshift(res.data.message);
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
