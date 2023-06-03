<!--
 * @Author: max
 * @Date: 2022-04-01 17:32:54
 * @LastEditTime: 2023-04-28 13:43:00
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/quality/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="公司名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['enterpriseId']" placeholder="请选择公司名称">
                    <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="到货单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入到货单号" v-decorator="['arrivalno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['itemName']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['itemCode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入规格" v-decorator="['itemSpecification']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="图号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入图号" v-decorator="['drawingno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="供应商编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商编码" v-decorator="['suppliercode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="供应商" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商" v-decorator="['supplier']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select style="width: 200px" allowClear placeholder="请选择状态" v-decorator="['tableStatus']">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="已完结">已完结</a-select-option>
                    <a-select-option value="已作废">已作废</a-select-option>
                  </a-select>
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
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          size="small"
          :scroll="{ y: scrollY }"
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
              <a style="margin-right: 8px" v-if="record.TableStatus !== '已作废'" @click="onCause(record)" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                作废签样
              </a>
            </div>
          </template>
        </a-table>
        <BatchAdd v-if="isAdd" :isEdit="isEdit" :plantList="enterList" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
        <Cause v-if="isCause" @closeModal="closeModal" @success="success" />
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getQualitySpecimen, setQualitySpecimen, getMaterialSampleApi } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./overdue.js";
import BatchAdd from "./batchAdd.vue";
import Cause from "./cause.vue";
export default {
  mixins: [PublicVar],
  components: { BatchAdd, Cause },
  data() {
    return {
      columns, //显示列
      scrollY: "",
      advanced: true,
      isExportLod: false,
      dataSource: [],
      isDrawer: false,
      enterList: [],
      isSearch: 0,
      isAdd: false,
      editData: [],
      isEdit: false,
      isEditForm: false,
      isCause: false,
      causeData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(100);
    });
    this.getEnterList();
  },
  methods: {
    splitData,
    //查看详情
    closeModal() {
      this.isAdd = false;
      this.isCause = false;
    },
    onCause(record) {
      this.isCause = true;
      this.causeData = record;
    },
    success(form) {
      let params = {
        RegisterId: this.causeData.Id, //签样ID
        ReturnReason: form.ReturnReason,
      };
      setQualitySpecimen(params, "ngregister").then((res) => {
        if (res.data.success) {
          this.$message.success("作废签样成功!");
          this.searchBtn();
        }
      });
    },
    //重置搜索
    reset() {
      this.week = "";
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.getEnterList();
    },
    getEnterList() {
      let params = {
        entertypecode: "COMPANY",
      };
      getMaterialSampleApi(params, "getenterlist").then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
          this.searchForm.setFieldsValue({
            enterpriseId: this.enterList[0].EnterId,
          });
          this.searchBtn();
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
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseId: values.enterpriseId,
            docNo: values.docNo || "",
            itemCode: values.itemCode || "",
            itemName: values.itemName || "",
            itemSpecification: values.itemSpecification || "",
            supplier: values.supplier || "",
            tableStatus: values.tableStatus || "",
            suppliercode: values.suppliercode || "",
            drawingno: values.drawingno || "",
          };
          getQualitySpecimen(params, "getregisterlist").then((res) => {
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
    //单个删除
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseId: values.enterpriseId,
        docNo: values.docNo || "",
        itemCode: values.itemCode || "",
        itemName: values.itemName || "",
        itemSpecification: values.itemSpecification || "",
        supplier: values.supplier || "",
        tableStatus: values.tableStatus || "",
        suppliercode: values.suppliercode || "",
        drawingno: values.drawingno || "",
      };
      getQualitySpecimen(params, "getregisterlist").then((res) => {
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
            ExportExcel(header, dataSource, `品质录入签样_${timestamp}.xlsx`);
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
