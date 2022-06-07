<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2022-06-06 14:57:43
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/production/components/printQr.vue
-->
<template>
  <a-modal v-model="visible" title="打印生产投料单" v-if="visible" @cancel="close" :footer="null" centered width="50%">
    <a-button style="float:right" type="primary" class="no-print" @click="updatedStatu" v-print="'#printTest'">打印</a-button>
    <div class="content" id="printTest">
      <div class="content-top">
        <div class="head-img"><img src="@/assets/img/mb.png" alt="" /></div>
        <div class="head-title">
          <p>深圳民爆光电股份有限公司</p>
          <p>生产投料单</p>
        </div>
        <div class="head-qr"><vue-qr :text="printData.QRCode" :size="500"></vue-qr></div>
      </div>
      <div class="print-footer">
        <p>工单单号:{{ printData.MoCode }}</p>
        <p>制单:{{ printData.VoucherMaker }}</p>
        <p>核准:{{ printData.Reviewer }}</p>
      </div>
      <div class="info">
        <a-descriptions columns="3">
          <a-descriptions-item label="产品品号">
            {{ printData.ProCode }}
          </a-descriptions-item>
          <a-descriptions-item label="工作中心">
            {{ printData.WorkCenterName }}
          </a-descriptions-item>
          <a-descriptions-item label="预计开工日期">
            {{ printData.PlanStartDateTime }}
          </a-descriptions-item>
          <a-descriptions-item label="预计产量">
            {{ printData.MoQty }}
          </a-descriptions-item>
          <a-descriptions-item label="生产部门">
            {{ printData.ProductionDept }}
          </a-descriptions-item>
          <a-descriptions-item label="预计完工日期">
            {{ printData.PlanEdnDateTime }}
          </a-descriptions-item>
          <a-descriptions-item label="需求单号">
            {{ printData.SalesOrderNo }}
          </a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">
            {{ printData.Remarks }}
          </a-descriptions-item>
          <a-descriptions-item label="品名" :span="3">
            {{ printData.ProName }}
          </a-descriptions-item>
          <a-descriptions-item label="规格" :span="3">
            {{ printData.ProSpec }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <!-- <a-table :columns="columns" :data-source="data" size="small" :pagination="false" :rowKey="(data) => data.MitemCode" bordered style="page-break-after:always">
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
      </a-table> -->
    </div>
  </a-modal>
</template>

<script>
import { setPrintInfo } from "@/services/web.js";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "材料品号",
    dataIndex: "MitemCode",
    align: "center",
    width: 80,
  },
  {
    title: "旧料号",
    dataIndex: "OldMitemCode",
    align: "center",
    width: 60,
  },
  {
    title: " 材料品名",
    dataIndex: "MitemName",
    align: "center",
    width: 80,
  },
  {
    title: "规格",
    dataIndex: "MitemSpec",
    align: "center",
    width: 100,
  },
  {
    title: "用量",
    dataIndex: "PackingQty",
    align: "center",
    width: 100,
  },
  {
    title: "位置号",
    dataIndex: "SequenceNumber",
    align: "center",
    width: 60,
  },
  {
    title: "需领用量",
    dataIndex: "UsedQty",
    align: "center",
    width: 100,
  },
  {
    title: "单位",
    dataIndex: "Unit",
    align: "center",
    width: 60,
  },
  {
    title: "发料仓库",
    dataIndex: "Warehouse",
    align: "center",
    width: 100,
  },
];
import vueQr from "vue-qr";
export default {
  props: ["printData"],
  components: { vueQr },
  data() {
    return {
      data: [],
      columns,
      loading: true,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 100, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      selectedRows: [],
      plantList: [],
      workshopList: [],
      lineList: [],
      isExecl: false,
      selectedRowKeys: [],
      scrollY: "",
      searchForm: this.$form.createForm(this),
      week: "",
      plantId: "",
      workshopId: "",
      lineId: "",
      isSearch: false,
      isUserList: false,
      visible: true,
    };
  },
  created() {
    console.log("this.printData====",this.printData)
    this.$nextTick(() => {
      this.data = this.printData.MitemDetails;
      console.log(this.data)
    });
  },
  methods: {
    close() {
      this.$emit("closeModal");
      this.data = [];
    },
    updatedStatu() {
      console.log("打印=====");
      let parmas = [this.printData.id];
      setPrintInfo(parmas, "update").then((res) => {
        if (res.data.success) {
          this.$message.success("打印成功!");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.content {
  margin: 0 auto;
}
.head-img {
  text-align: center;
  width: 260px;
  height: 70px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-qr {
  text-align: center;
  width: 140px;
  height: 140px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-title {
  text-align: center;
  p {
    padding: 0;
    margin: 0;
    font-size: 24px;
    color: #000;
    font-weight: 700;
  }
}
.info {
  margin: 0 auto;
  border: 1px #000 solid;
  padding: 10px 10px;
  // border-bottom: none;
}
/deep/.ant-descriptions-item {
  padding-bottom: 2px;
}
/deep/.ant-descriptions-item-label {
  font-size: 16px;
}
/deep/.ant-descriptions-item-content {
  font-size: 16px;
}
/deep/.ant-table-small {
  border: 1px #000 solid;
  // border-top: none;
  // border-bottom: none;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th {
  // border: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
  font-size: 16px;
}
/deep/.ant-table-body {
  margin: 0;
}
/deep/.ant-table-column-title {
  font-size: 16px;
}
/deep/.ant-table-thead > tr > th {
  border-bottom: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th,
.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
}
/deep/.ant-table-tbody > tr > td {
  border-bottom: 1px #000 solid;
}
/deep/.ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
.print-footer,
.content-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  p {
    flex: 3;
    text-align: center;
    padding: 5px 0;
    margin: 0;
  }
}
</style>
