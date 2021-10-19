<!--
 * @Author: max
 * @Date: 2021-09-07 15:05:20
 * @LastEditTime: 2021-10-19 15:57:37
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
                  <!-- <a-input placeholder="请输入产品大类" allowClear v-decorator="['itemsort']" /> -->
                  <a-select show-search placeholder="请选择大类" option-filter-prop="children" style="width: 200px" :filter-option="filterOption" v-decorator="['itemsort']">
                    <a-select-option v-for="(item, index) in categoryList" :value="item" :key="index">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品型号" allowClear v-decorator="['itemname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="BOM号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品BOM号" allowClear v-decorator="['itemcode']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="24" :sm="24">
                <span style="float: right; margin-top: 3px;">
                  <a-button type="primary" :disabled="!hasPerm('search_public')" @click="search">查询</a-button>
                  <a-button style="margin-left: 8px" :disabled="!hasPerm('search_public')" @click="reset">重置</a-button>
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? "收起" : "展开" }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </div>
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
    width: "3%",
  },
  {
    title: "需求公司",
    dataIndex: "EnterpriseName",
    scopedSlots: { customRender: "description" },
    align: "center",
    width: "5%",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    align: "center",
    width: "5%",
  },
  {
    title: "产品大类",
    dataIndex: "ItemSort",
    align: "center",
    width: "5%",
  },
  {
    title: "BOM号",
    dataIndex: "ItemCode",
    align: "center",
  },
  {
    title: "产品型号",
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
    title: "审核人",
    dataIndex: "UserCheck",
    scopedSlots: { customRender: "UserCheck" },
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
    title: "上阶BOM号",
    dataIndex: "LastCode",
    width: "10%",
  },
  {
    title: "BOM号",
    dataIndex: "ChildCode",
  },
  {
    title: "产品型号",
    dataIndex: "ChildName",
  },
  {
    title: " 产品规格",
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
// import { funtransformF } from "./excel";
import HistoryList from "./HistoryList";
import { exportjsontoexcelMore } from "./exportExcel";
export default {
  components: { ADetails, HistoryList },
  props: ["categoryList"],
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
      historyType: "",
      isSearch: false,
      exportData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    // if (!this.hasPerm("search_public")) {
    //   return;
    // }
    this.getDemandEnter();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    //重置
    //重置搜索
    reset() {
      this.getDemandEnter();
      this.searchForm.resetFields();
    },
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
      this.loading = true;
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
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.isSearch = false;
        } else {
          this.dataSource = [];
          this.pagination.current = 1;
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
          getCostConfig(parmas, "getquotelistcommon").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = true;
            } else {
              this.dataSource = [];
              this.pagination.current = 1;
              this.pagination.total = 0;
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
      if (this.isSearch) {
        this.search();
        return;
      }
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
    arrayGroup(arr) {
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.CostSort]) {
          dest.push({
            CostSort: ai.CostSort,
            list: [ai],
          });
          map[ai.CostSort] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.CostSort == ai.CostSort) {
              dj.list.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },
    //导出数据
    handleExcel(id) {
      let parmas = {
        Id: id,
      };
      getCostConfig(parmas, "getquotedetail").then((res) => {
        if (res.data.success) {
          let list = res.data.data.ItemInfo.ItemChildList;
          this.exportData = list;
          let info = res.data.data.ItemInfo;
          let ConfigList = this.arrayGroup(res.data.data.ConfigList);
          let _data = [];
          let mergeTitle = [];
          for (let i = 0; i < 6; i++) {
            mergeTitle.push({
              s: { r: i, c: 1 },
              e: { r: i, c: 14 },
            });
          }
          _data.push(["需求公司", info.EnterpriseName, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["需求工厂", info.PlantName, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["BOM号", info.ItemCode, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["产品型号", info.ItemName, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["大类", info.ItemSort, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push([" 产品规格", info.ItemSpecification, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          let cost = [];
          ConfigList.map((item) => {
            cost = cost.concat(item.list);
          });
          console.log("ConfigList===", ConfigList);
          cost.map((item, index) => {
            let array = [item.CostSort, item.CostName, null, item.Amount, null, null, null, null, null, null, null, null, null, null, null];
            _data.push(array);
            mergeTitle.push({
              s: { r: 6 + index, c: 1 },
              e: { r: 6 + index, c: 2 },
            });
            mergeTitle.push({
              s: { r: 6 + index, c: 3 },
              e: { r: 6 + index, c: 14 },
            });
          });
          ConfigList.map((item, index) => {
            let l = item.list.length - 1;
            if (index == 0) {
              mergeTitle.push({
                s: { r: 6, c: 0 },
                e: { r: 6 + l, c: 0 },
              });
            } else {
              mergeTitle.push({
                s: { r: 6 + ConfigList[index - 1].list.length, c: 0 },
                e: { r: 6 + l + ConfigList[index - 1].list.length, c: 0 },
              });
              console.log({
                s: { r: 6 + ConfigList[index - 1].list.length, c: 0 },
                e: { r: 6 + l + ConfigList[index - 1].list.length, c: 0 },
              });
            }
          });
          _data.push(["物料成本", info.MaterialCost, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["最终成本", info.FinalCost, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          mergeTitle.push({
            s: { r: 6 + cost.length, c: 1 },
            e: { r: 6 + cost.length, c: 14 },
          });
          mergeTitle.push({
            s: { r: 7 + cost.length, c: 1 },
            e: { r: 7 + cost.length, c: 14 },
          });
          const columns = [];
          this.excelHead.map((item) => {
            columns.push(item.title);
          });
          columns.splice(8, 0, "价格来源");
          _data.push(columns);
          let _data1 = [..._data];
          list.map((item) => {
            let array = [];
            Object.keys(item).forEach((key) => {
              array.push(item[key]);
            });
            _data.push(array);
          });
          this.exportData.map((item) => {
            let array1 = [];
            if (item.LvNo != 2) {
              Object.keys(item).forEach((key) => {
                array1.push(item[key]);
              });
              _data1.push(array1);
            }
          });
          let excelArray = [];
          let contentList = [];
          let merges2 = []; // 设置表格内容单元格合并
          let aoa = [..._data, ...contentList]; // 导出的数据
          let aoa1 = [..._data1, ...contentList]; // 导出的数据
          let merges = [...mergeTitle, ...merges2]; // 合并单元格
          // 样式修改
          const sheetCols = [
            { wch: 10 }, // 序号
            { wch: 5 }, // 阶次
            { wch: 8 }, // 类型
            { wch: 10 }, // 上阶BOM号
            { wch: 10 }, // BOM号
            { wch: 18 }, // 料名
            { wch: 20 }, //  产品规格
            { wch: 6 }, // 单位
            { wch: 8 }, // 价格来源
            { wch: 7 }, // E10单价
            { wch: 7 }, // 单价
            { wch: 7 }, // 用量
            { wch: 6 }, // 金额
            { wch: 10 }, // 提示
            { wch: 10 }, // 备注
          ];
          let formStyle = {};
          excelArray.push({
            Sheet: `展开显示`, // 下方tab切换名称
            data: aoa, // 表格数据
            merges, //  合并单元格
            autoWidth: false, // 自适应宽度
            formStyle: formStyle, // 特殊行或列样式
            sheetCols,
          });
          excelArray.push({
            Sheet: `收缩显示`, // 下方tab切换名称
            data: aoa1, // 表格数据
            merges, //  合并单元格
            autoWidth: false, // 自适应宽度
            formStyle: formStyle, // 特殊行或列样式
            sheetCols,
          });
          try {
            var temp = info.ItemName.replace(/['//<>%;.)(&+]/g, " ").replace(/(^\s)|(\s$)/g, "");
            exportjsontoexcelMore({
              dataList: excelArray,
              bookType: "xlsx", // 导出类型
              filename: `${info.ItemCode}_${temp}`, // 导出标题名
            });
            this.$message.success("导出数据成功!");
          } catch (error) {
            this.$message.error("导出数据失败");
          }
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
