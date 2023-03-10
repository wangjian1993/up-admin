<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2023-01-06 16:41:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/process/components/bomSelect.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="投料选择" @cancel="close" :footer="null" centered width="70%">
      <a-row>
        <a-col :span="6">
          <a-card class="card" title="投料列表" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns1" :data-source="bomList" :scroll="{ y: 500 }" :size="size" :pagination="false" :rowKey="(bomList) => bomList.MitemCode" :customRow="rowClick" :rowClassName="tableRowClassName"  bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
            </a-table>
          </a-card>
        </a-col>
        <a-col :span="18">
          <a-card class="card" title="物料采购单信息列表" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="orderList" :scroll="{ y: 500 }" :size="size" :pagination="false" :rowKey="(orderList,index) => orderList.PurchaseNo + '_'+ index" :customRow="rowOrderClick" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
const columns1 = [
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
    width: 120,
  },
];
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "采购单号",
    dataIndex: "PurchaseNo",
    scopedSlots: { customRender: "PurchaseNo" },
    align: "center",
    width: 120,
  },
  {
    title: "料号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 120,
  },
  {
    title: "供应商",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
    width: 120,
  },
  {
    title: "下单日期",
    dataIndex: "DatetimeOrder",
    scopedSlots: { customRender: "DatetimeOrder" },
    align: "center",
    width: 120,
  },
];
import { splitData } from "@/utils/util.js";
import { getReleases, getOrderInfo } from "@/services/mes.js";
export default {
  props: ["orderInfo"],
  data() {
    return {
      data: [],
      columns,
      columns1,
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
      bomList: [],
      orderList: [],
      selectIndex: "",
      selectCode: "",
    };
  },
  created() {
    this.getBomList();
  },
  methods: {
    splitData,
    closeModal() {
      this.isPrint = true;
    },
    getBomList() {
      let params = {
        mocode: this.orderInfo.MoCode,
        lineid: this.orderInfo.LineId,
      };
      getReleases(params, "getreleases").then((res) => {
        if (res.data.success) {
          const { BomList, ReleaseList } = res.data.data;
          this.bomList = BomList;
          this.releaseList = ReleaseList;
        }
      });
    },
    rowClick(record) {
      return {
        style: {
          cursor: "pointer",
        },
        on: {
          click: () => {
            console.log("点击了我", record);
            this.selectCode = record.MitemCode;
            console.log(" this.selectCode===", this.selectCode);
            let params = {
              MitemCode: record.MitemCode,
            };
            getOrderInfo(params, "getreleases").then((res) => {
              if (res.data.success) {
                this.orderList = res.data.data;
              }
            });
          },
        },
      };
    },
    rowOrderClick(record){
      return {
        style: {
          cursor: "pointer",
        },
        on: {
          click: () => {
            console.log("点击了我", record);
            this.$emit('success',record.QRCode)
          },
        },
      };
    },
    tableRowClassName(record) {
      console.log("record----",record)
      // let num = record.ReleaseQty < record.ReleasedQty;
      if (record.ReleasedQty >= record.ReleaseQty) {
        return "blue";
      }
    },
    getOrderList(code) {
      console.log("11111");
      let params = {
        MitemCode: code,
      };
      getOrderInfo(params, "getreleases").then((res) => {
        if (res.data.success) {
          const { data } = res.data.data;
          this.orderList = data;
        }
      });
    },
    close() {
      this.$emit("closeModal");
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
// .selectBg {
//   background: rgb(32, 165, 138);
// }
</style>
<style>
.selectBg {
  background-color: #13c2c2;
}
</style>
