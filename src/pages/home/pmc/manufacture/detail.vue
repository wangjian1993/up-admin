<!--
 * @Author: max
 * @Date: 2021-08-30 13:39:50
 * @LastEditTime: 2022-07-28 09:01:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/manufacture/detail.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
    <a-form layout="horizontal" :form="searchForm">
      <div :class="advanced ? null : 'fold'">
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['workshop']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['line']" style="width: 200px" placeholder="请选择生产产线">
                <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['status']" placeholder="请选择状态" style="width: 200px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="item.ParamCode" v-for="(item, index) in stateList" :key="index">
                  {{ item.ParamName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="advanced">
          <a-col :md="6" :sm="24">
            <a-form-item label="日计划批号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" placeholder="请输入日计划批号" v-decorator="['batchno']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" placeholder="请输入品号" v-decorator="['mitemcode']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input style="width: 200px" placeholder="请输入品名" v-decorator="['mitemname']" />
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
        <a-button type="primary" @click="searchBtn">查询</a-button>
        <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        <a @click="toggleAdvanced" style="margin-left: 8px">
          {{ advanced ? "收起" : "展开" }}
          <a-icon :type="advanced ? 'up' : 'down'" />
        </a>
      </span>
    </a-form>
    <div class="operator">
      <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      size="small"
      :scroll="{ y: scrollY, x: 2500 }"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
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
      <template slot="Status" slot-scope="text, record">
        <div>
          <a-tag :color="text !== 'APPROVAL' ? 'green' : 'red'">{{ record.StatusName }}</a-tag>
        </div>
      </template>
      <template slot="OrderDeliveryDate" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
      <template slot="OrderDate" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="details(record)">
            <a-icon type="profile" />
            查看明细
          </a>
        </div>
      </template>
    </a-table>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="详情" :column="1">
          <a-descriptions-item v-for="(item, index) in filterData" :key="index" :label="item.title">{{ drawerItem[item.dataIndex] }}</a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
    </a-spin>
  </div>
</template>

<script>
import { getDailyPlan, getWorkshopList, getLineList } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "50px",
  },
  {
    title: "日计划批号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: "80px",
  },
  {
    title: "生产车间",
    dataIndex: "WorkShopName",
    scopedSlots: { customRender: "WorkShopName" },
    align: "center",
    width: "80px",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
    width: "60px",
  },
  {
    title: "计划生产日期",
    dataIndex: "PlanDate",
    align: "center",
  },
  {
    title: "工单号",
    dataIndex: "WorkOrderNo",
    scopedSlots: { customRender: "WorkOrderNo" },
    align: "center",
  },
  {
    title: "业务订单号",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: "5%",
  },
  {
    title: "内部订单号",
    dataIndex: "InnerOrderNo",
    scopedSlots: { customRender: "InnerOrderNo" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "订单交期",
    dataIndex: "OrderDeliveryDate",
    scopedSlots: { customRender: "OrderDeliveryDate" },
    align: "center",
  },
  {
    title: "下单日期",
    dataIndex: "OrderDate",
    scopedSlots: { customRender: "OrderDate" },
    align: "center",
  },
  {
    title: "订单数量",
    dataIndex: "OrderQty",
    scopedSlots: { customRender: "OrderQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "计划数量",
    dataIndex: "PlanQty",
    scopedSlots: { customRender: "PlanQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "人均标准产量",
    dataIndex: "PerCapitaCapacity",
    scopedSlots: { customRender: "PerCapitaCapacity" },
    align: "center",
    width: "80px",
  },
  {
    title: "工时",
    dataIndex: "WorkHour",
    scopedSlots: { customRender: "WorkHour" },
    align: "center",
    width: "80px",
  },
  {
    title: "物料库存情况",
    dataIndex: "MaterialShortage",
    scopedSlots: { customRender: "MaterialShortage" },
    align: "center",
    width: "200px",
  },
  {
    title: "备注",
    dataIndex: "Remarks",
    scopedSlots: { customRender: "Remarks" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    fixed: "right",
    width: 100,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
export default {
  props: ["detailData", "stateList"],
  data() {
    return {
      scrollY: "",
      loading: false,
      advanced: true,
      columns: columns,
      dataSource: [],
      isDrawer: false,
      isSearch: false,
      selectedRowKeys: [],
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
      searchForm: this.$form.createForm(this),
      plantList: [],
      workshopList: [],
      lineList: [],
      plantId: "",
      workshopId: "",
      lineId: "",
      week: "",
      drawerItem: [],
      isExportLod:false
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.search();
    this.getPlant();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    filterData() {
      return this.columns.filter((obj) => {
        return obj.dataIndex;
      });
    },
  },
  methods: {
    splitData,
    //关闭弹出框
    onClose() {
      this.isDrawer = false;
    },
    //查看详情
    details(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //重置搜索
    reset() {
      // this.getListAll();
      this.searchForm.resetFields();
      this.search();
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    //获取需求工厂
    getPlant() {
      let params = {
        entertypecode: "PLANT",
      };
      getDailyPlan(params, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let params = {
        plantid: this.plantId,
      };
      getWorkshopList(params, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let params = {
        plantid: this.plantId,
        workshopId: this.workshopId,
      };
      getLineList(params).then((res) => {
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
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        batchno: this.detailData.BatchNo || "",
        PlantId: this.detailData.PlantId,
      };
      this.searchForm.setFieldsValue({
        plantid: this.detailData.PlantId,
        batchno: this.detailData.BatchNo,
      });
      getDailyPlan(params, "detail/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
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
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
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
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          this.dataSourcedata = [];
          this.pagination.total = 0;
          if (values["range-time-picker"] != undefined) {
            var begindt = this.formatDateTime(values["range-time-picker"][0]);
            var enddt = this.formatDateTime(values["range-time-picker"][1]);
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            workshop: values.workshop,
            line: values.line,
            status: values.status,
            batchno: values.batchno,
            startdate: begindt,
            enddate: enddt,
            mitemcode: values.mitemcode,
            mitemname: values.mitemname,
          };
          getDailyPlan(params, "detail/getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
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
    exportExcel() {
      this.isExportLod =true
      const dataSource = this.dataSource.map((item) => {
        Object.keys(item).forEach((key) => {
          // 后端传null node写入会有问题
          if (item[key] === null) {
            item[key] = "";
          }
          if (Array.isArray(item[key])) {
            item[key] = item[key].join(",");
          }
        });
        return item;
      });
      const header = [];
      this.columns.map((item) => {
        if (item.dataIndex) {
          header.push({ key: item.dataIndex, title: item.title });
        }
      });
      var timestamp = Date.parse(new Date());
      try {
        ExportExcel(header, dataSource, `生产日计划明细_${timestamp}.xlsx`);
        this.$message.success("导出数据成功!");
      } catch (error) {
        console.log(error);
        this.$message.error("导出数据失败");
      }
      this.isExportLod =false
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-table {
  min-height: 60vh;
}
</style>
