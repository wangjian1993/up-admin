<!--
 * @Author: max
 * @Date: 2021-09-23 14:02:00
 * @LastEditTime: 2021-11-22 10:17:14
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/supplierReply/DetailMerge.vue
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
                <a-input placeholder="请输入品号" allowClear style="width: 200px" v-decorator="['mitemcode']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入品名" allowClear style="width: 200px" v-decorator="['mitemname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="时间选择" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
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
        <template slot="Status" slot-scope="text, record">
          <div>
            <a-tag :color="record.StatusName === '待审' || record.StatusName === '匹配错误' || record.StatusName === '部分推送' || record.StatusName === '推送异常' ? 'red' : 'green'">{{ record.StatusName }}</a-tag>
          </div>
        </template>
        <template slot="time" slot-scope="text">
          <div v-if="text.RequirementQty > 0">
            <span :style="{ color: text.Color, fontWeight: '700' }">{{ text.RequirementQty + "-" + text.ReplyQty }}</span>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <requirement v-if="isDetail" :detailData="detailData" :isReplies="true" @closeModal="closeModal"></requirement>
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
    width: 200,
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 200,
  },
  {
    title: " 产品规格",
    dataIndex: "Spec",
    scopedSlots: { customRender: "Spec" },
    align: "center",
    width: 250,
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
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
    width: 80,
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getSupplierAction } from "@/services/web.js";
import Requirement from "@/components/requirement/Requirement.vue";
import XLSX from "xlsx";
import { dColumns } from "@/mixins/requirement.js";
export default {
  mixins: [dColumns],
  components: { Requirement },
  props: ["plantList"],
  data() {
    return {
      data: [],
      columns,
      loading: false,
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
      timeDataLenght: 0,
      isExport: false,
      isExportLod: false,
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
      this.scrollY = getTableScroll(70);
    });
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
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getSupplierAction(parmas, "reply/getmergedetails").then((res) => {
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
    setTimeList() {
      let dateList = this.data[0].RequirementDetails;
      dateList.forEach((item, index) => {
        let dateArray = item.RequirementDate.split(/T|-/);
        this.columns.push({
          title: dateArray[1] + "/" + dateArray[2],
          dataIndex: "table_" + index,
          align: "center",
          width: "80px",
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
    renderTimeBackground(record) {
      let l = record.RequirementDetails.length;
      for (let i = 0; i < l; i++) {
        return {
          style: {
            "background-color": record["table_" + i].Color,
          },
        };
      }
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          this.columns = JSON.parse(JSON.stringify(this.dColumns));
          this.data = [];
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
          getSupplierAction(parmas, "reply/getmergedetails").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              if (this.data.length > 0) {
                this.setTimeList();
              }
              console.log(this.data);
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
    //分页
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
      this.isExportLod = true;
      let inputData = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        batchno: inputData.batchno,
      };
      getSupplierAction(parmas, "reply/getmergedetails").then((res) => {
        if (res.data.success) {
          var _data = [];
          let dataSource = [];
          let list = res.data.data.list;
          dataSource = list.map((item) => {
            let obj = {};
            item.RequirementDetails.map((items, index) => {
              if (items.RequirementQty > 0) {
                obj["table_" + index] = items.RequirementQty + "-" + items.ReplyQty;
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
          this.isExportLod = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
</style>
