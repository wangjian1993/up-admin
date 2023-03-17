<!--
 * @Author: max
 * @Date: 2022-04-01 17:32:54
 * @LastEditTime: 2023-03-16 17:28:17
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/quality/incomingInspection/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="业务公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['enterid']" style="width: 200px" placeholder="请选择业务公司">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="测试项目" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['item']" style="width: 200px" placeholder="请选择测试项目">
                    <a-select-option v-for="item in paramsItem.IQC_INCOMING_TEST_ITEM" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="测试结果" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['result']" style="width: 200px" placeholder="请选择测试结果">
                    <a-select-option v-for="item in paramsItem.IQC_INCOMING_TEST_ITEM_RESULT" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="到货单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入到货单号" v-decorator="['arrivalno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="料号/料名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入料号/料名" v-decorator="['materal']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="采购单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入采购单号" v-decorator="['pono']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="供应商编码/名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商编码/名称" v-decorator="['supplier']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="测试日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">   
          <a-button type="primary" @click="add" :disabled="!hasPerm('add')" icon="plus">新增</a-button>
          <a-button style="margin-left: 8px" :disabled="!hasPerm('export') && dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button v-if="hasPerm('edit')" icon="edit" type="primary" :disabled="!hasSelected" :loading="loading" @click="allEdit" style="margin-left: 8px">修改</a-button>
          <a-button v-else icon="edit" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">修改</a-button>
          <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
          <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
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
          :scroll="{ y: scrollY, x: true }"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          :rowKey="(dataSource, index) => dataSource.id"
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
          <template slot="action" slot-scope="text, record">
            <div>
              <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px"  @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <BatchAdd v-if="isAdd" :isEdit="isEdit" :paramsItem="paramsItem" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
      <EditForm v-if="isEditForm" :paramsItem="paramsItem" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
    </a-spin>
  </div>
</template>

<script>
import { getIncomingTest, setIncomingTest } from "@/services/qms.js";
import { getProductionPersonnel } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./overdue.js";
import { getParamData } from "@/services/admin.js";
import BatchAdd from "./batchAdd.vue";
import EditForm from "./editForm.vue";
export default {
  mixins: [PublicVar],
  components: { BatchAdd, EditForm },
  data() {
    return {
      columns, //显示列
      scrollY: "",
      advanced: true,
      isExportLod: false,
      dataSource: [],
      isDrawer: false,
      plantList: [],
      isSearch: 0,
      isAdd: false,
      editData: [],
      isEdit: false,
      isEditForm: false,
      processList: [],
      paramsList: ["IQC_INCOMING_TEST_ITEM", "IQC_INCOMING_TEST_ITEM_RESULT"],
      paramsItem: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(100);
    });
    this.search();
    this.getPlant();
    this.getParamsData();
  },
  methods: {
    splitData,
    getParamsData() {
      this.paramsList.forEach((item) => {
        let params = {
          groupcode: item,
        };
        getParamData(params).then((res) => {
          if (res.data.success) {
            this.paramsItem[item] = res.data.data;
          }
        });
      });
    },
    //查看详情
    closeModal() {
      this.isAdd = false;
      this.isEditForm = false;
    },
    //重置搜索
    reset() {
      this.week = "";
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.search();
    },
    getPlant() {
      let params1 = {
        entertypecode: "COMPANY",
      };
      getProductionPersonnel(params1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    add() {
      this.editData = [];
      this.isAdd = true;
      this.isEdit = false;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.searchBtn();
    },
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
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
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var begindate = rangeValue[0].format("YYYY-MM-DD");
            var enddate = rangeValue[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterid: values.enterid,
            item: values.item,
            line: values.lineid,
            result: values.result,
            materal: values.materal,
            arrivalno: values.arrivalno,
            pono: values.pono,
            supplier: values.supplier,
            startdate: begindate,
            enddate: enddate,
            process: values.process,
          };
          getIncomingTest(params, "getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = 2;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    onDelete(item) {
      let params = [];
      params.push(item.id);
      setIncomingTest(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.searchBtn();
        }
      });
    },
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setIncomingTest(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.searchBtn();
            }
          });
        },
        onCancel() {},
      });
    },
    edit(record) {
      this.editData = {
        CompanyCode: record.EnterId,
        CompanyName: record.EnterName,
        DocNo: record.ArrivalOrderNo,
        ItemCode: record.MitemCode,
        ItemDescription: record.MitemName,
        ItemSpecification: record.MitemSpec,
        PuchaseOrderNo: record.PurchaseOrderNo,
        Qty: record.InComingQty,
        SupplierCode: record.SupplierCode,
        SupplierFullName: record.SupplierName,
        Unit: record.Unit,
        TestItem: record.TestItem,
        TestResult: record.TestResult,
        id: record.id,
        Remarks: record.Remarks,
      };
      this.isEditForm = true;
    },
    allEdit() {
      this.editData = [];
      this.dataSource.forEach((item) => {
        if (this.selectedRowKeys.includes(item.id)) {
          this.editData.push({
            CompanyCode: item.EnterId,
            CompanyName: item.EnterName,
            DocNo: item.ArrivalOrderNo,
            ItemCode: item.MitemCode,
            ItemDescription: item.MitemName,
            ItemSpecification: item.MitemSpec,
            PuchaseOrderNo: item.PurchaseOrderNo,
            Qty: item.InComingQty,
            SupplierCode: item.SupplierCode,
            SupplierFullName: item.SupplierName,
            Unit: item.Unit,
            TestItem: item.TestItem,
            TestResult: item.TestResult,
            id: item.id,
            Remarks: item.Remarks,
          });
        }
      });
      this.isAdd = true;
      this.isEdit = true;
      this.selectedRowKeys = [];
    },
    //单个删除
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
        const rangeValue = values["range-time-picker"];
        var begindate = rangeValue[0].format("YYYY-MM-DD");
        var enddate = rangeValue[1].format("YYYY-MM-DD");
      }
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterid: values.enterid,
        item: values.item,
        line: values.lineid,
        result: values.result,
        materal: values.materal,
        arrivalno: values.arrivalno,
        pono: values.pono,
        supplier: values.supplier,
        startdate: begindate,
        enddate: enddate,
        process: values.process,
      };
      getIncomingTest(params, "getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item, index) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              item.index = index + 1;
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
            ExportExcel(header, dataSource, `来料品质检测_${timestamp}.xlsx`);
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

<style scoped lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
