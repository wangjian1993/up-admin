<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-11-16 13:55:01
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/pringt.vue
-->
<template>
  <div class="content" id="printTest">
    <a-button type="primary" class="no-print" v-print="'#printTest'">打印</a-button>
    <a-row>
      <a-col :span="8"
        ><div class="head-img"><img src="@/assets/img/mb.png" alt="" /></div
      ></a-col>
      <a-col :span="8"
        ><div class="head-title">
          <p>深圳民爆光电股份有限公司</p>
          <p>生产投料单</p>
        </div></a-col
      >
      <a-col :span="8"
        ><div class="head-qr"><img src="@/assets/img/logo.png" alt="" /></div
      ></a-col>
    </a-row>
    <p>工单单号:111111</p>
    <div class="info">
      <a-descriptions>
        <a-descriptions-item label="UserName">
          Zhou Maomao
        </a-descriptions-item>
        <a-descriptions-item label="Telephone">
          1810000000
        </a-descriptions-item>
        <a-descriptions-item label="Live">
          Hangzhou, Zhejiang
        </a-descriptions-item>
        <a-descriptions-item label="Remark">
          empty
        </a-descriptions-item>
        <a-descriptions-item label="Address">
          No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <a-table :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.Id" bordered style="page-break-after:always">
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
    </a-table>
    <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
  </div>
</template>

<script>
import UserList from "@/components/app-user/UserList";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "ItemSpecification",
    align: "center",
    width: "20%",
  },
  {
    title: "物料成本",
    dataIndex: "MaterialCost",
    align: "center",
    width:100,
  },
  {
    title: "最终成本",
    dataIndex: "FinalCost",
    align: "center",
    width:100,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import { getDailyPlan, dailyPlanAction, getWorkshopList, getLineList, getCostConfig } from "@/services/web.js";
export default {
  components: { UserList },
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
    };
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getListAll();
  },
  methods: {
    goPrint() {
      // eslint-disable-next-line no-undef
      printJS(this.$refs.printCons);
    },
    //pmc选择
    userSearch() {
      this.isUserList = true;
    },
    closeUserModal() {
      this.isUserList = false;
    },
    okUserModal(item) {
      this.isUserList = false;
      this.searchForm.setFieldsValue({
        pmc: item.Name,
      });
    },
    detail(item) {
      // this.$router.push({ path: "/purchase/add", query: { id:item.Id} });
      this.$emit("toDetail", item);
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    closeModal() {
      this.isExecl = false;
      this.getListAll();
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: 100,
        enterpriseid: "738158234C824177B852FBCFF02EC928",
        plantid: "EDC8B0D024BE4209BFB0BDB2BB0BCBEB",
        statuscheck: "",
        itemsort: "",
        itemcode: "",
        itemname: "",
      };
      getCostConfig(parmas, "getquotelistcommon").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    //获取需求工厂
    getPlant() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getDailyPlan(parmas, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let parmas = {
        plantid: this.plantId,
      };
      getWorkshopList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantId,
        workshopId: this.workshopId,
      };
      getLineList(parmas).then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    //工厂选择
    plantChange(e) {
      this.plantId = e;
      this.getWorkshopList();
    },
    //车间选择
    workshopChange(e) {
      this.workshopId = e;
      this.getLineList();
    },
    //关闭弹窗
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    //格式化时间
    formatDateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          if (values["range-time-picker"] != undefined) {
            var begindt = this.formatDateTime(values["range-time-picker"][0]);
            var enddt = this.formatDateTime(values["range-time-picker"][1]);
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            perqty: values.perqty,
            pmc: values.pmc,
            workshop: values.workshop,
            line: values.line,
            startdate: begindt,
            enddate: enddt,
          };
          getDailyPlan(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.Status !== "APPROVAL", // Column configuration not to be checked
      },
    }),
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          dailyPlanAction(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //多选审批
    allCheck() {
      let self = this;
      self.$confirm({
        title: "确定要审批选中内容",
        onOk() {
          dailyPlanAction(self.selectedRowKeys, "approved").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("审批成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    actionBnt(item, type) {
      console.log(item);
      let parmas = [];
      parmas.push(item.Id);
      dailyPlanAction(parmas, type).then((res) => {
        if (res.data.success) {
          if (type == "approved") {
            this.$message.success("审批成功!");
          } else {
            this.$message.success("删除成功!");
          }
          this.getListAll();
        }
      });
    },
    importExcel() {
      this.isExecl = true;
    },
    //分压
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getListAll();
    },
    downloadExcel() {
      // window.location.open = "./Upload/excel/20211008/物料需求计划导入模板.xlsx";
      window.open("./Upload/excel/20211008/生产日计划导入模板.xlsx", "_blank");
      // let a = document.createElement("a");
      // a.href = "./Upload/excel/20211008/物料需求计划导入模板.xlsx";
      // a.click();
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.content {
  width: 800px;
  margin: 0 auto;
}
.head-img {
  text-align: center;
  width: 200px;
  height: 50px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-qr {
  text-align: center;
  width: 100px;
  height: 100px;
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
    font-size: 20px;
    color: #000;
    font-weight: 700;
  }
}
.info {
  width: 800px;
  margin: 0 auto;
  border: 1px #000 solid;
  padding: 10px 10px;
}
</style>
