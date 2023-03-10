<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2023-01-06 16:38:08
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/process/components/batchingScan.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="扫码投料" @cancel="close" :footer="null" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="8">
              <div>
                <a-descriptions :column="1" size="small">
                  <a-descriptions-item label="生产工厂/车间/产线" :span="2"> {{ orderInfo.PlantName }}/{{ orderInfo.WorkshopName }}/{{ orderInfo.LineName }} </a-descriptions-item>
                  <a-descriptions-item label="当前工单"> {{ orderInfo.MoCode }}</a-descriptions-item>
                  <a-descriptions-item label="投料扫码" :span="2">
                    <div style="display:flex"><a-input style="width:300px;" allowClear ref="orderValue1" v-model.trim="orderValue" placeholder="" @change="inputChange" @blur="inputBlur()" @pressEnter="scanCode" auto-size /><a-button style="margin-left:10px" shape="circle" icon="profile" @click="orderShow" /></div>
                  </a-descriptions-item>
                  <a-descriptions-item label="投料数量"><a-input-number id="inputNumber" v-model="ReleaseQty" :min="0"/></a-descriptions-item>
                  <a-descriptions-item label="所需料号"> {{ bomInfo.MitemCode }}</a-descriptions-item>
                  <a-descriptions-item label="所需料名">{{ bomInfo.MitemName }}</a-descriptions-item>
                  <a-descriptions-item label="需要投料数量">{{ bomInfo.ReleaseQty }}</a-descriptions-item>
                  <a-descriptions-item label="已投料数量">{{ bomInfo.ReleasedQty }}</a-descriptions-item>
                  <a-descriptions-item label="剩余可投料数量">{{ bomInfo.RemainingQty }}</a-descriptions-item>
                  <a-descriptions-item>
                    <a-button type="primary" icon="check-circle" @click="submitBtn" :disabled="!isStart">
                      投料
                    </a-button>
                  </a-descriptions-item>
                </a-descriptions>
              </div>
              <div>
                <MsgList :listData="listData" :IsSuccess="IsSuccess" @closeList="closeListData" />
              </div>
            </a-col>
            <a-col :span="16">
              <a-table :columns="columns" :data-source="releaseList" :size="size" :pagination="false" :rowKey="(list) => list.ProPlanId" :scroll="{ y: 500 }" bordered>
                <template slot="index" slot-scope="text, record, index">
                  <div>
                    <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                  </div>
                </template></a-table
              ></a-col
            >
          </a-row>
        </a-card>
      </div>
    </a-modal>
    <bom-select v-if="isBomSelect" :orderInfo="orderInfo" @closeModal="closeModal" @success="setOrderValue" />
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
    title: "投料料号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 160,
  },
  {
    title: "料名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 100,
  },
  {
    title: "所需用量",
    dataIndex: "ReleaseQty",
    scopedSlots: { customRender: "ReleaseQty" },
    align: "center",
    width: 80,
  },
  {
    title: "投料数量",
    dataIndex: "ReleasedQty",
    scopedSlots: { customRender: "ReleasedQty" },
    align: "center",
    width: 80,
  },
  {
    title: "投料时间",
    dataIndex: "DatetimeRelease",
    scopedSlots: { customRender: "DatetimeRelease" },
    align: "center",
    width: 120,
  },
  {
    title: "投料人",
    dataIndex: "UserRelease",
    scopedSlots: { customRender: "UserRelease" },
    align: "center",
    width: 100,
  },
  {
    title: "采购单号",
    dataIndex: "PuraseNo",
    scopedSlots: { customRender: "PuraseNo" },
    align: "center",
    width: 100,
  },
];
import { splitData } from "@/utils/util.js";
import { getReleases } from "@/services/mes.js";
import BomSelect from "./bomSelect.vue";
import { getProcessReport } from "@/services/mes.js";
import { getTimeData } from "@/utils/util";
import MsgList from "../../components/MsgList.vue";
export default {
  props: ["orderInfo"],
  components: { BomSelect, MsgList },
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
      isBomSelect: false,
      releaseList: [],
      listData: [],
      IsSuccess: false,
      bomInfo: [],
      ReleaseQty: 0,
      isStart: false,
      orderValue: "",
    };
  },
  created() {
    this.getList();
    console.log("orderInfo===", this.orderInfo);
  },
  mounted() {
    if (!this.isFocus) {
      setTimeout(() => {
        this.$refs.orderValue1.focus();
      }, 100);
    }
  },
  methods: {
    splitData,
    orderShow() {
      this.isBomSelect = true;
    },
    closeListData() {
      this.listData = [];
    },
    closeModal() {
      this.isBomSelect = false;
    },
    close() {
      this.$emit("closeModal");
    },
    setOrderValue(value) {
      this.isBomSelect = false;
      this.orderValue = value;
      this.scanCode();
    },
    inputChange(e) {
      const { value } = e.target;
      if (!value && e.type !== "change") {
        // do something
        this.emptyData();
      }
    },
    scanCode(e) {
      try {
        e.currentTarget.select();
        if (e.keyCode == 13) {
          event.preventDefault(); // 阻止浏览器默认换行操作
        }
      } catch (error) {
        console.log("error===");
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
      console.log("this.orderValue===", this.orderValue);
      let params = {
        ScanCode: this.orderValue,
        LineId: this.orderInfo.LineId,
        MoCode: this.orderInfo.MoCode,
      };
      getProcessReport(params, "release/scan").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            this.isStart = true;
            res.data.message.content = res.data.data.Msg;
            this.bomInfo = res.data.data.result;
            this.ReleaseQty = this.bomInfo.RemainingQty;
            this.listData.unshift(res.data.message);
            this.getList();
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    submitBtn() {
      if (this.ReleaseQty == 0) {
        let message = {
          content: "请先输入投料数量",
          time: getTimeData(),
          IsSuccess: false,
        };
        this.listData.unshift(message);
        return;
      }
      let params = {
        ScanCode: this.orderValue,
        LineId: this.bomInfo.LineId,
        MoCode: this.bomInfo.MoCode,
        PlantId: this.bomInfo.PlantId,
        MitemCode: this.bomInfo.MitemCode,
        PurchaseNo: this.orderValue,
        ReleaseQty: this.ReleaseQty,
        ReleasedQty: this.bomInfo.ReleasedQty,
      };
      getProcessReport(params, "release/sumbit").then((res) => {
        res.data.message.time = getTimeData();
        if (res.data.success) {
          res.data.message.IsSuccess = true;
          res.data.message.content = "投料成功";
          this.listData.unshift(res.data.message);
          this.getList();
          this.bomInfo = [];
          this.orderValue = "";
          this.ReleaseQty = 0;
          this.isStart = false;
        }
      });
    },
    getList() {
      let params = {
        mocode: this.orderInfo.MoCode,
        lineid: this.orderInfo.LineId,
      };
      getReleases(params, "getreleases").then((res) => {
        console.log(res);
        if (res.data.success) {
          const { BomList, ReleaseList } = res.data.data;
          this.bomList = BomList;
          this.releaseList = ReleaseList;
        }
      });
    },
  },
};
</script>

<style lang="less">
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
/deep/.ant-table-tbody .blue {
  background-color: #2dce5d !important;
}
</style>
