<!--
 * @Author: max
 * @Date: 2022-05-05 11:01:59
 * @LastEditTime: 2022-12-13 09:32:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/financial/expense.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <a-row>
            <a-col :span="8">
              <a-radio-group style="margin-top: 5px;" default-value="全部" v-model="listType" button-style="solid" @change="searchBtn">
                <a-radio-button v-for="(item, index) in tagItem" :value="item" :key="index">
                  {{ item }}
                </a-radio-button>
              </a-radio-group></a-col
            >
            <a-col :md="6" :sm="24">
              <a-form-item label="" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 300px" allowClear placeholder="供应商,费用单号" v-decorator="['keyword']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" style="margin-top: 5px;" @click="searchBtn">查询</a-button>
              <a-button style="margin-left: 8px;margin-top: 5px;" @click="reset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
        <div class="operator">
          <a-button style="margin-left: 8px" type="primary" @click="add" icon="plus">新建费用单</a-button>
          <a-button style="margin-left: 8px" :disabled="!hasPerm('export') && dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          size="small"
          :scroll="{ y: scrollY }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :rowKey="(dataSource) => dataSource.Id"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="OrderNoTitle">
            <p>对账单号</p>
            <p>对账周期</p>
          </template>
          <template slot="OrderNo" slot-scope="text, record">
            <p>{{ record.OrderNo }}</p>
            <p>{{ record.BillCycle }}</p>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="detail(record)">
                <a-icon type="container" />
                查看
              </a>
              <a-popconfirm title="确定删除?" @confirm="() => onDelete(record, 'delete')">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px" @click="onEdit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <Detail v-if="isDetail" :detailId="detailId" @closeModal="closeModal" />
      <AddExpense v-if="isAdd" :isEdit="isEdit" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
    </a-spin>
  </div>
</template>

<script>
import { getExpense ,setExpense } from "@/services/srm.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data/expense";
import ExportExcel from "@/utils/ExportExcelJS";
import Detail from "./detail.vue";
import AddExpense from "./component/addExpense.vue";
export default {
  components: { AddExpense,Detail},
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: false,
      columns,
      dataSource: [],
      isSearch: 0,
      isExportLod: false,
      selectedRowKeys: [],
      isImport: false,
      listType: "全部",
      isDetail: false,
      detailId: "",
      isAdd: false,
      tagItem: ["全部", "待发送", "已确认", "退回"],
      editData:[],
      isEdit:false
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
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.listType = "全部";
      this.search();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
      if (this.advanced) {
        console.log("打开====");
        this.scrollY = getTableScroll(210);
      } else {
        console.log("关闭====");
        this.scrollY = getTableScroll(-60);
      }
      console.log("scrollY===", this.scrollY);
    },
    closeModal() {
      this.isDetail = false;
      this.isAdd = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.search();
    },
    add() {
      this.isAdd = true;
      this.editData = [];
      this.isEdit = false;
    },
    onEdit(record){
      getExpense({ id: record.Id }, "single").then((res) => {
        if (res.data.success) {
          this.isAdd = true;
          this.editData = res.data.data;
          console.log(" this.editDat111111111===", this.editData)
          this.isEdit = true;
        }
      });
    },
    onDelete(record) {
      let params = [record.Id];
      setExpense(params, 'delete').then((res) => {
        if (res.data.success) {
          this.$message.success("操作成功!");
          this.search();
        }
      });
    },
    detail(record) {
      this.isDetail = true;
      this.detailId = record.Id;
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue = values["range-time-picker1"];
            var startpurchasedatetime = rangeValue[0].format("YYYY-MM-DD");
            var endpurchasedatetime = rangeValue[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] && values["range-time-picker2"].length == 2) {
            const rangeValue = values["range-time-picker2"];
            var startdeliverydatetime = rangeValue[0].format("YYYY-MM-DD");
            var enddeliverydatetime = rangeValue[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.keyword,
            tag: this.listType,
            supplier: values.supplier,
            orderno: values.orderno,
            product: values.product,
            purchaseuser: values.purchaseuser,
            startpurchasedatetime: startpurchasedatetime,
            endpurchasedatetime: endpurchasedatetime,
            startdeliverydatetime: startdeliverydatetime,
            enddeliverydatetime: enddeliverydatetime,
            purchasestatus: values.purchasestatus,
            receiptstatus: values.receiptstatus,
            purchasetype: values.purchasetype,
          };
          getExpense(params, "get").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
              this.pagination = pagination;
              this.isSearch = 2;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        typeid: values.typeid,
        brand: values.brand,
        status: values.status,
        plccode: values.plccode,
        plcname: values.plcname,
      };
      getExpense(params, "get").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item) => {
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
          columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `PLC列表_${timestamp}.xlsx`);
            this.$message.success("导出数据成功!");
          } catch (error) {
            // console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
        }
      });
    },
  },
};
</script>

<style lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
