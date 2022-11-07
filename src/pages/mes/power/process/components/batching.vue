<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2022-10-28 09:35:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/process/components/batching.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="投料列表" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :bodyStyle="{ padding: '5px 10px' }">
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="12">
              <a-table :columns="columns" :data-source="bomList" :size="size" :pagination="false" :rowKey="(list) => list.ProPlanId" :customRow="rowClick" :rowClassName="tableRowClassName" bordered>
                <template slot="index" slot-scope="text, record, index">
                  <div>
                    <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                  </div>
                </template>
              </a-table></a-col
            >
            <a-col :span="12"> <a-table :columns="columns1" :data-source="releaseList" :size="size" :pagination="false" :rowKey="(list) => list.ProPlanId" bordered> </a-table></a-col>
          </a-row>
        </a-card>
      </div>
    </a-drawer>
    <SetQty v-if="isSetQty" :orderInfo="orderInfo" :bomInfo="bomInfo" @closeModal="closeModal" @success="getList" />
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
    title: "所需料号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 120,
  },
  {
    title: "所需料名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 120,
  },
  {
    title: "所需用量",
    dataIndex: "StandardQty",
    scopedSlots: { customRender: "StandardQty" },
    align: "center",
    width: 120,
  },
  {
    title: "已投料数量",
    dataIndex: "ReleasedQty",
    scopedSlots: { customRender: "ReleasedQty" },
    align: "center",
    width: 120,
  },
];
const columns1 = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "所需料号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 120,
  },
  {
    title: "料名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 120,
  },
  {
    title: "所需用量",
    dataIndex: "StartedQty",
    scopedSlots: { customRender: "StartedQty" },
    align: "center",
    width: 80,
  },
  {
    title: "投料数量",
    dataIndex: "ReleaseQty",
    scopedSlots: { customRender: "ReleaseQty" },
    align: "center",
    width: 80,
  },
  {
    title: "投料时间",
    dataIndex: "DatetimeRelease",
    scopedSlots: { customRender: "DatetimeRelease" },
    align: "center",
    width: 150,
  },
];
import { splitData } from "@/utils/util.js";
import { getReleases } from "@/services/mes.js";
import SetQty from "./setQty.vue";
export default {
  props: ["orderInfo"],
  components: { SetQty },
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
      selectedRowKeys: [],
      selectionType: "checkbox",
      bomList: [],
      releaseList: [],
      isSetQty: false,
      bomInfo: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    splitData,
    closeModal() {
      this.isSetQty = false;
    },
    close() {
      this.$emit("closeModal");
    },
    rowClick: function(record) {
      return {
        style: {
          cursor: "pointer",
        },
        on: {
          click: () => {
            console.log("点击了我", record);
            let num = record.StandardQty - record.ReleasedQty;
            if (num == 0) {
              console.log("num===", num);
              this.$message.warning("不需要再投料了");
              return;
            }
            this.isSetQty = true;
            this.bomInfo = record;
          },
        },
      };
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
    tableRowClassName(record) {
      let num = record.StandardQty - record.ReleasedQty;
      if (num == 0) {
        return "blue";
      }
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
/deep/.ant-table-tbody .blue {
  background-color: #2dce5d !important;
}
</style>
