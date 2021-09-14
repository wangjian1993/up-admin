<!--
 * @Author: max
 * @Date: 2021-09-07 15:05:20
 * @LastEditTime: 2021-09-14 10:34:20
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/ListPublic.vue
-->
<template>
  <div>
    <div>
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="需求公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select
                    placeholder="请选择需求公司"
                    v-decorator="[
                      'enterpriseid',
                      {
                        rules: [{ required: true, message: '请选择需求公司' }],
                      },
                    ]"
                  >
                    <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select
                    placeholder="请选择生产工厂"
                    v-decorator="[
                      'plantid',
                      {
                        rules: [{ required: true, message: '请选择生产工厂' }],
                      },
                    ]"
                  >
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select default-value="1" disabled>
                    <a-select-option value="1">
                      已审核
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品大类" v-decorator="['ItemSort']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品名" v-decorator="['itemname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品号" v-decorator="['itemcode']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" :disabled="!hasPerm('search_public')" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" :disabled="!hasPerm('search_public')">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>
    </div>
    <div>
      <!-- <a-space class="operator">
        <a-button icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="checkAll" style="margin-left: 8px">审批</a-button>
        <a-button icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `共选中 ${selectedRowKeys.length} 条` }}
          </template>
        </span>
      </a-space> -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        size="small"
        :scroll="{ y: scrollY }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(dataSource) => dataSource.Id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        bordered
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="StatusCheck" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">已审核</a-tag>
            <a-tag color="red" v-else>未审核</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" @click="details(record.Id)">
              <a-icon type="profile" />
              详情
            </a>
            <a style="margin-right: 8px" @click="handleExcel(record.Id)">
              <a-icon type="export" />
              导出
            </a>
            <a style="margin-right: 8px" @click="history(record)">
              <a-icon type="history" />
              历史版本
            </a>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 详情 -->
    <a-details v-if="isDetails" :detailsId="detailsId" @closeModal="closeModal"></a-details>
    <!-- 历史版本 -->
    <history-list v-if="isHistory" :historyData="historyData" @closeModal="closeHistory" @details="details" @handleExcel="handleExcel" :historyType="historyType"></history-list>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "需求公司",
    dataIndex: "EnterpriseName",
    scopedSlots: { customRender: "description" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    align: "center",
  },
  {
    title: "产品大类",
    dataIndex: "ItemSort",
    align: "center",
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
    title: "规格",
    dataIndex: "ItemSpecification",
    align: "center",
  },
  {
    title: "物料成本",
    dataIndex: "MaterialCost",
    align: "center",
    width: "5%",
  },
  {
    title: "最终成本",
    dataIndex: "FinalCost",
    align: "center",
    width: "5%",
  },
  {
    title: "状态",
    dataIndex: "StatusCheck",
    scopedSlots: { customRender: "StatusCheck" },
    align: "center",
    width: "5%",
  },
  {
    title: "创建日期",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
  },
  {
    title: "最新版本",
    dataIndex: "QuoteVersion",
    scopedSlots: { customRender: "QuoteVersion" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
const excelHead = [
  {
    title: "序号",
    dataIndex: "IndexNo",
    align: "center",
    width: "4%",
  },
  {
    title: "阶次",
    dataIndex: "LvNo",
    width: "5%",
  },
  {
    title: "类型",
    dataIndex: "Property",
    scopedSlots: { customRender: "Property" },
    width: "5%",
  },
  {
    title: "上阶料号",
    dataIndex: "LastCode",
    width: "10%",
  },
  {
    title: "料号",
    dataIndex: "ChildCode",
  },
  {
    title: "料名",
    dataIndex: "ChildName",
  },
  {
    title: "料规格",
    dataIndex: "ChildSpecification",
  },
  {
    title: "单位",
    dataIndex: "UnitName",
    width: "5%",
  },
  {
    title: "E10单价",
    dataIndex: "PriceErp",
    scopedSlots: { customRender: "e10" },
    width: "5%",
  },
  {
    title: "单价",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
  },
  {
    title: "用量",
    dataIndex: "Yl",
    width: "5%",
  },
  {
    title: "金额",
    dataIndex: "Amount",
  },
  {
    title: "提示",
    dataIndex: "Tips",
    scopedSlots: { customRender: "Tips" },
    width: "5%",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "action" },
  },
];
import { getDemandEnter, getCostConfig, addCost } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import ADetails from "./Details.vue";
import XLSX from "xlsx";
import HistoryList from "./HistoryList";
export default {
  components: { ADetails, HistoryList },
  data() {
    return {
      loading: false,
      advanced: true,
      columns: columns,
      excelHead,
      dataSource: [],
      selectedRows: [],
      plantList: [],
      enterList: [],
      form: [],
      searchForm: this.$form.createForm(this),
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
      plantid: "",
      enterpriseid: "",
      scrollY: "",
      isDetails: false,
      detailsId: "",
      selectedRowKeys: [],
      status: "Y",
      isHistory: false,
      historyData: [],
      historyType:""
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    if (!this.hasPerm("search_public")) {
      return;
    }
    this.getDemandEnter();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    closeHistory() {
      this.isHistory = false;
    },
    history(item) {
      this.isHistory = true;
      this.historyData = item;
    },
    //获取需求公司
    getDemandEnter() {
      let parmas = {
        entertypecode: "COMPANY",
      };
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDemandEnter(parmas).then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
          this.enterpriseid = this.enterList[0].EnterId;
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterList[0].EnterId,
          });
          getDemandEnter(parmas1).then((res) => {
            if (res.data.success) {
              this.plantList = res.data.data;
              this.plantid = this.plantList[0].EnterId;
              this.searchForm.setFieldsValue({
                plantid: this.plantList[0].EnterId,
              });
              this.getCostList();
            }
          });
        }
      });
    },
    //获取列表信息
    getCostList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterpriseid,
        plantid: this.plantid,
        statuscheck: "",
        itemsort: "",
        itemcode: "",
        itemname: "",
      };
      getCostConfig(parmas, "getquotelistcommon").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          console.log(this.dataSource);
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    //搜素
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            plantid: values.plantid,
            statuscheck: values.statuscheck || "",
            itemsort: values.itemsort || "",
            itemcode: values.itemcode || "",
            itemname: values.itemname || "",
          };
          getCostConfig(parmas, "getquotelist").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      });
    },
    //展开收起
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //审核
    onAudit(item) {
      let parmas = {
        Id: item.Id,
        StatusCheck: item.StatusCheck == "Y" ? "N" : "Y",
      };
      addCost(parmas, "checkquote").then((res) => {
        if (res.data.success) {
          this.$message.success("审核成功!");
          this.getCostList();
        }
      });
    },
    //删除
    onDelete(item) {
      let parmas = {
        Id: item.Id,
        IsDelete: "Y",
      };
      addCost(parmas, "deletequote").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getCostList();
        }
      });
    },
    //分页按钮
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getCostList();
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //多选判断
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.StatusCheck === "Y", // Column configuration not to be checked
      },
    }),
    //查看详情
    details(id) {
      this.isDetails = true;
      this.detailsId = id;
    },
    //关闭弹窗
    closeModal() {
      this.isDetails = false;
    },
    //导出数据
    handleExcel(id) {
      let parmas = {
        Id: id,
      };
      getCostConfig(parmas, "getquotedetail").then((res) => {
        if (res.data.success) {
          let list = res.data.data.ItemInfo.ItemChildList;
          let info = res.data.data.ItemInfo;
          let ConfigList = res.data.data.ConfigList;
          var _data = [];
          _data.push(["需求公司", info.EnterpriseName, "", "需求工厂", info.PlantName]);
          _data.push(["品号", info.ItemCode, "", "品名", info.ItemName, "", "大类", info.ItemSort]);
          _data.push(["规格", info.ItemSpecification]);
          ConfigList.map((item) => {
            let array = [item.CostName, item.Amount, item.Description];
            _data.push(array);
          });
          _data.push(["物料成本", info.MaterialCost, "最终成本", info.FinalCost]);
          const columns = [];
          this.excelHead.map((item) => {
            columns.push(item.title);
          });
          columns.splice(8, 0, "价格来源");
          _data.push(columns);
          list.map((item) => {
            let array = [];
            Object.keys(item).forEach((key) => {
              array.push(item[key]);
            });
            _data.push(array);
          });
          const ws = XLSX.utils.aoa_to_sheet(_data);
          /* generate workbook and add the worksheet */
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, info.ItemName);
          /* save to file */
          XLSX.writeFile(wb, `${info.ItemName}_采购报价导出.xlsx`);
          this.$message.success("导出成功!");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-table-body {
  min-height: 55vh;
}
</style>
