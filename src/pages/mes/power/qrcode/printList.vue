<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2022-11-11 16:49:09
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/qrcode/printList.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="IsRePrint == 'Y' ? '补打产品追溯码' : '打印产品追溯码'" @cancel="close" @ok="handleOk" centered width="70%">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            v-if="IsRePrint == 'Y'"
            :columns="columns"
            :data-source="data"
            :size="size"
            :pagination="false"
            :rowKey="(orderSelectList) => orderSelectList.QrId"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
          <a-table v-else :columns="columns" :data-source="data" :size="size" :pagination="false" :rowKey="(orderSelectList) => orderSelectList.QrId" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
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
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "追溯码",
    dataIndex: "QrCode",
    scopedSlots: { customRender: "QrCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品名",
    dataIndex: "ProName",
    scopedSlots: { customRender: "ProName" },
    align: "center",
    width: 120,
  },
  {
    title: "完工时间",
    dataIndex: "DateTimeFinished",
    scopedSlots: { customRender: "DateTimeFinished" },
    align: "center",
    width: 120,
  },
  {
    title: "首次打印时间",
    dataIndex: "DateTimePrint",
    scopedSlots: { customRender: "DateTimePrint" },
    align: "center",
    width: "80px",
  },
  {
    title: "首次打印人",
    dataIndex: "DateTimeReprint",
    scopedSlots: { customRender: "DateTimeReprint" },
    align: "center",
    width: "80px",
  },
  {
    title: "已打印次数",
    dataIndex: "PrintCount",
    scopedSlots: { customRender: "PrintCount" },
    align: "center",
    width: "80px",
  },
];
import { splitData } from "@/utils/util.js";
import { getQrCode } from "@/services/mes.js";
export default {
  props: ["orderInfo", "IsRePrint"],
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
      isPrint: false,
      printData: [],
      selectedRowKeys: [],
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getPrintList();
  },
  methods: {
    splitData,
    closeModal() {
      this.isPrint = true;
    },
    close() {
      this.$emit("closeModal");
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getPrintList() {
      let params = {
        LineId: this.orderInfo.LineId,
        MoCode: this.orderInfo.MoCode,
        IsRePrint: this.IsRePrint,
      };
      getQrCode(params, "getprints").then((res) => {
        console.log("res----", res);
        if (res.data.success) {
          this.data = res.data.data;
        }
      });
    },
    handleOk() {
      if (this.IsRePrint == "Y" && this.selectedRowKeys.length == 0) {
        this.$message.warn("请先选择要补打的工单");
        return;
      }
      let list = [];
      if (this.IsRePrint == "Y") {
        this.data.forEach((row) => {
          if (this.selectedRowKeys.includes(row.QrId)) {
            list.push(row);
          }
        });
      } else {
        list = this.data;
      }
      this.$emit("success", list);
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
</style>
