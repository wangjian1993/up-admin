<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-11-22 10:15:46
 * @LastEditors: max
 * @Description: 物料需求总计划明细
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/DetailMerge.vue
-->

<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="计划批号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入计划批号" allowClear style="width: 200px" v-decorator="['batchno', { rules: [{ required: true, message: '请输入计划批号' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="周" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-week-picker placeholder="选择周" @change="weekChange" v-decorator="['week']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入品号号" allowClear style="width: 200px" v-decorator="['mitemcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入品名" allowClear style="width: 200px" v-decorator="['mitemname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="导入时间选择" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 400px" v-decorator="['range-time-picker']" show-time format="YYYY-MM-DD HH:mm:ss" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
      </a-form>
      <div class="operator">
        <a-button v-if="hasPerm('export')" :disabled="!isExport" type="primary" @click="handleExcel" icon="export">导出</a-button>
        <a-button v-else type="primary" disabled @click="handleExcel" icon="export">导出</a-button>
      </div>
      <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 4000 }" :loading="loading" :pagination="pagination" @change="handleTableChange" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="StatusName" slot-scope="text">
          <div>
            <a-tag :color="text === '待审' || text === '匹配错误' || text === '部分推送' || text === '推送异常' || text === '有差异_未确认' ? 'red' : 'green'">{{ text }}</a-tag>
          </div>
        </template>
        <template slot="time" slot-scope="text">
          <div v-if="text.RequirementQty > 0">
            <span :style="{ color: 'red', fontWeight: '700' }">{{ text.RequirementQty }}</span>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <requirement v-if="isDetail" :detailData="detailData" @closeModal="closeModal"></requirement>
    </a-spin>
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
    title: "计划批号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
    width: 200,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: 100,
  },
  {
    title: "周",
    dataIndex: "Week",
    scopedSlots: { customRender: "Week" },
    align: "center",
    width: 50,
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "Spec",
    scopedSlots: { customRender: "Spec" },
    align: "center",
    width: 300,
  },
  {
    title: "需求数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: 80,
  },
  {
    title: "计划状态",
    dataIndex: "StatusName",
    scopedSlots: { customRender: "StatusName" },
    align: "center",
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getMitemrequirement, mitemrequirementAction } from "@/services/web.js";
import Requirement from "@/components/requirement/Requirement.vue";
import XLSX from "xlsx";
import { dColumns } from "@/mixins/requirement.js";
export default {
  mixins: [dColumns],
  components: { Requirement },
  props: ["plantList", "batchid"],
  data() {
    return {
      data: [],
      columns,
      columns1: columns,
      loading: true,
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
      selectedRows: [],
      isExecl: false,
      selectedRowKeys: [],
      scrollY: "",
      searchForm: this.$form.createForm(this),
      week: "",
      isSearch: false,
      isDetail: false,
      detailData: [],
      isExport: false,
      isExportLod:false
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
    this.$nextTick(() => {
      this.scrollY = getTableScroll(110);
    });
    if (this.batchid == "") {
      this.getListAll();
    }
    if (this.batchid) {
      this.$nextTick(() => {
        this.searchForm.setFieldsValue({
          batchno: this.batchid,
        });
      });
    }
    // this.getListAll();
  },
  methods: {
    closeModal() {
      this.isDetail = false;
    },
    //物料需求详情
    detail(item) {
      this.isDetail = true;
      this.detailData = item;
    },
    //周选择
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    setTimeList() {
      let dateList = this.data[0].RequirementDetails;
      dateList.forEach((item, index) => {
        let dateArray = item.RequirementDate.split(/T|-/);
        this.columns.push({
          title: dateArray[1] + "/" + dateArray[2],
          dataIndex: "table_" + index,
          align: "center",
          width: "60px",
          scopedSlots: { customRender: "time" },
        });
      });
      this.data = this.data.map((item) => {
        let obj = {};
        item.RequirementDetails.map((items, index) => {
          obj["table_" + index] = items;
          items.key = "table_" + index;
        });
        return { ...item, ...obj };
      });
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        batchno: this.batchid || "",
      };
      getMitemrequirement(parmas, "masterplan/getmergedetails").then((res) => {
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
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.week = "";
      this.data = [];
      this.isExport = false;
      this.loading = false;
      this.searchForm.resetFields();
      this.columns.forEach((item, index) => {
        if (item.dataIndex && item.scopedSlots.customRender === "time") {
          console.log(index);
          this.columns.splice(index, 1);
        }
      });
    },
    //日期转换
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
          console.log("Received values of form: ", values.week);
          this.data = [];
          this.columns = JSON.parse(JSON.stringify(this.dColumns));
          this.pagination.total = 0;
          if (values["range-time-picker"] != undefined) {
            var begindt = this.formatDateTime(values["range-time-picker"][0]);
            var enddt = this.formatDateTime(values["range-time-picker"][1]);
          }
          if (this.week != "") {
            var w = this.week;
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            week: w,
            batchno: values.batchno,
            mitemcode: values.mitemcode,
            mitemname: values.mitemname,
            startdate: begindt,
            enddate: enddt,
          };
          getMitemrequirement(parmas, "masterplan/getmergedetails").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              if (this.data.length > 0) {
                this.setTimeList();
              }
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
              this.isExport = true;
            }
          });
          // do something
        }
      });
    },
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.Status !== "APPROVED", // Column configuration not to be checked
      },
    }),
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          mitemrequirementAction(self.selectedRowKeys, "masterplan/delete").then((res) => {
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
        title: "确定要生成选中内容",
        onOk() {
          mitemrequirementAction(self.selectedRowKeys, "masterplan/generate").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("生成成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    actionBnt(item, type) {
      let parmas = [];
      parmas.push(item.Id);
      mitemrequirementAction(parmas, type).then((res) => {
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
    //导出excel数据
    handleExcel() {
      this.isExportLod =true
      let inputData = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        batchno: inputData.batchno,
      };
      getMitemrequirement(parmas, "masterplan/getmergedetails").then((res) => {
        if (res.data.success) {
          var _data = [];
          let dataSource = [];
          let list = res.data.data.list;
          // let dateArray = item.RequirementDate.split(/T|-/);
          dataSource = list.map((item) => {
            let obj = {};
            item.RequirementDetails.map((items, index) => {
              if (items.RequirementQty > 0) {
                obj["table_" + index] = items.RequirementQty;
              } else {
                obj["table_" + index] = "";
              }
            });
            return { ...item, ...obj };
          });
          const header = [];
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push(item.title);
            }
          });
          _data.push(header);
          dataSource.forEach((item) => {
            let array = [];
            this.columns.map((items) => {
              if (items.dataIndex) {
                array.push(item[items.dataIndex]);
              }
            });
            _data.push(array);
          });
          const ws = XLSX.utils.aoa_to_sheet(_data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, `${inputData.batchno}`);
          /* save to file */
          try {
            let name = `'物联需求总计划明细_${inputData.batchno}'` + ".xlsx";
            XLSX.writeFile(wb, name);
            this.$message.success("导出数据成功!");
          } catch (error) {
            console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod =false
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 60vh;
}
</style>
