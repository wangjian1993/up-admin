<!--
 * @Author: max
 * @Date: 2021-09-07 15:05:20
 * @LastEditTime: 2021-09-24 17:15:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/ListSearch.vue
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
                  <a-select placeholder="请选择" v-decorator="['statuscheck']">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="Y">已审核</a-select-option>
                    <a-select-option value="N">未审核</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <!-- <a-input placeholder="请输入产品大类" allowClear v-decorator="['itemsort']" /> -->
                  <a-select show-search placeholder="请选择大类" option-filter-prop="children" style="width: 200px" :filter-option="filterOption"  v-decorator="['itemsort']">
                    <a-select-option v-for="(item, index) in categoryList" :value="item" :key="index">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品名" allowClear v-decorator="['itemname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品号" allowClear v-decorator="['itemcode']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search" :disabled="!hasPerm('search_purchase')">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search_purchase')">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>
    </div>
    <div>
      <a-space class="operator">
        <a-button v-if="hasPerm('approve')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="checkAll" style="margin-left: 8px">审批</a-button>
        <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="checkAll" style="margin-left: 8px">审批</a-button>
        <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
        <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `共选中 ${selectedRowKeys.length} 条` }}
          </template>
        </span>
      </a-space>
      <a-table
        v-if="hasPerm('search_purchase')"
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
            <a-popconfirm v-if="record.StatusCheck == 'N'" title="确定审核?" @confirm="() => onAudit(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('approve')">
                <a-icon type="check-circle" />
                审核
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="details(record.Id)">
              <a-icon type="profile" />
              详情
            </a>
            <a-popconfirm title="确定删除?" v-if="record.StatusCheck == 'N'" @confirm="() => onDelete(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0" @click="handleExcel(record.Id)" :disabled="!hasPerm('export')">导出</a-menu-item>
                <a-menu-item key="1" @click="reloadCost(record.Id, 'COPY')" :disabled="!hasPerm('copy')">复制报价</a-menu-item>
                <a-menu-item key="2" @click="reloadCost(record.Id, 'ANEW')" :disabled="!hasPerm('again')">重新报价</a-menu-item>
                <a-menu-item key="3" @click="history(record)" :disabled="!hasPerm('history')">历史版本</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </div>
    <!-- 详情 -->
    <a-details v-if="isDetails" :detailsId="detailsId" @closeModal="closeModal"></a-details>
    <!-- 历史版本 -->
    <history-list v-if="isHistory" :historyData="historyData" @closeModal="closeHistory" @details="details" @handleExcel="handleExcel" :historyType="historyType" @reloadCost="reloadCost" @onDelete="onDelete" @onAudit="onAudit"></history-list>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "4%",
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
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "Property",
    scopedSlots: { customRender: "Property" },
    width: "5%",
    align: "center",
  },
  {
    title: "上阶料号",
    dataIndex: "LastCode",
    width: "10%",
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ChildCode",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ChildName",
    align: "center",
  },
  {
    title: "规格",
    dataIndex: "ChildSpecification",
    width: "20%",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "UnitName",
    width: "5%",
    align: "center",
  },
  {
    title: "E10单价",
    dataIndex: "PriceErp",
    scopedSlots: { customRender: "e10" },
    width: "5%",
    align: "center",
  },
  {
    title: "单价",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
    align: "center",
  },
  {
    title: "用量",
    dataIndex: "Yl",
    width: "5%",
    align: "center",
  },
  {
    title: "金额",
    dataIndex: "Amount",
    align: "center",
  },
  {
    title: "提示",
    dataIndex: "Tips",
    scopedSlots: { customRender: "Tips" },
    width: "5%",
    align: "center",
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
import { exportjsontoexcelMore } from "./exportExcel";
import HistoryList from "./HistoryList";
export default {
  components: { ADetails, HistoryList },
  props: ["categoryList"],
  data() {
    return {
      loading: true,
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
      isHistory: false,
      historyData: [],
      historyType: "purchase",
      isSearch: false,
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    if (!this.hasPerm("search_purchase")) {
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
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    reset() {
      this.getDemandEnter();
      this.searchForm.resetFields();
    },
    //历史版本
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
      getCostConfig(parmas, "getquotelist").then((res) => {
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
              this.isSearch = true;
            } else {
              this.dataSource = [];
              this.pagination.current = 1;
            }
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      });
    },
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
    closeModal() {
      this.isDetails = false;
    },
    closeHistory() {
      this.isHistory = false;
    },
    reloadCost(id, sign) {
      this.isHistory = false;
      this.$router.push({ path: "/purchase/add", query: { id: id, sign: sign } });
      // if (sign == "copy") {
      //   this.$router.push({ path: "purchase/add", query: { id: id, sign: sign } });
      // } else {
      //   this.$router.push({ path: "quote/purchase/anew", query: { id: id, sign: sign } });
      // }
    },
    checkAll() {
      let self = this;
      console.log(self.selectedRowKeys);
      self.$confirm({
        title: "确定要审批选中内容",
        onOk() {
          const params = {
            Ids: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.Ids.push({
              Id: item,
            });
          });
          addCost(params, "checkquotemultiple").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("审批成功!");
              if (self.isSearch) {
                self.search();
                return;
              }
              self.getCostList();
            }
          });
        },
        onCancel() {},
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          const params = {
            Ids: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.Ids.push({
              Id: item,
            });
          });
          addCost(params, "deletequotemultiple").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              if (self.isSearch) {
                self.search();
                return;
              }
              self.getCostList();
            }
          });
        },
        onCancel() {},
      });
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
          let ConfigList = res.data.data.ConfigList;
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
          _data.push(["品号", info.ItemCode, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["品名", info.ItemName, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["大类", info.ItemSort, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["规格", info.ItemSpecification, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          ConfigList.map((item, index) => {
            let array = [item.CostName, item.Amount, null, null, null, null, null, null, null, null, null, null, null, null, null];
            _data.push(array);
            mergeTitle.push({
              s: { r: 6 + index, c: 1 },
              e: { r: 6 + index, c: 2 },
            });
            mergeTitle.push({
              s: { r: 6 + index, c: 2 },
              e: { r: 6 + index, c: 14 },
            });
          });
          _data.push(["物料成本", info.MaterialCost, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          _data.push(["最终成本", info.FinalCost, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          mergeTitle.push({
            s: { r: 6 + ConfigList.length, c: 1 },
            e: { r: 6 + ConfigList.length, c: 14 },
          });
          mergeTitle.push({
            s: { r: 7 + ConfigList.length, c: 1 },
            e: { r: 7 + ConfigList.length, c: 14 },
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
            if (item.LvNo == 2) {
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
            { wch: 10 }, // 上阶料号
            { wch: 10 }, // 料号
            { wch: 18 }, // 料名
            { wch: 20 }, // 规格
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
  min-height: 0vh;
}
/deep/.ant-table-body {
  min-height: 35vh;
}
</style>
