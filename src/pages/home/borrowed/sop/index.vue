<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-05-24 14:28:21
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/sop/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="文件名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入文件名称" v-decorator="['filename']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入编号" v-decorator="['no']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="文件编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入文件编号" v-decorator="['fileno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select style="width: 200px" allowClear placeholder="请选择状态" v-decorator="['status']">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="已借出">已借出</a-select-option>
                    <a-select-option value="已归还">已归还</a-select-option>
                    <a-select-option value="未使用">未使用</a-select-option>
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
          <!-- <a-button type="primary" @click="exportExcel" icon="export">导出</a-button> -->
          <a-button v-if="hasPerm('import')" icon="import" type="primary" :loading="loading" @click="isImportExcel = true" style="margin-left: 8px">导入</a-button>
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
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.Id"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="Status" slot-scope="record">
            <div>
              <a-tag color="orange" v-if="record === '已借出'">{{ record }}</a-tag>
              <a-tag color="green" v-if="record === '已归还'">{{ record }}</a-tag>
              <a-tag color="blue" v-if="record === '未使用'">{{ record }}</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="history(record)" :disabled="record.RowNumber == 0">
                <a-icon type="clock-circle" />
                历史
              </a>
              <a style="margin-right: 8px" @click="borrowed(record, false)" v-if="record.Status === '未使用' || record.Status === '已归还'">
                <a-icon type="export" />
                借出
              </a>
              <a style="margin-right: 8px" @click="borrowed(record, true)" v-if="record.Status === '已借出'">
                <a-icon type="export" />
                归还
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <useForm v-if="isForm" :isOut="isOut" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
      <HistoryList v-if="isHistory" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
      <ImportExcel v-if="isImportExcel" @closeModal="closeModal" :enterList="enterList" @success="searchBtn" />
    </a-spin>
  </div>
</template>

<script>
import { getBorrowedSop } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import useForm from "./form.vue";
import HistoryList from "./history.vue";
import ExportExcel from "@/utils/ExportExcelJS";
import ImportExcel from "./ImportExcel.vue";
export default {
  mixins: [PublicVar],
  components: { useForm, HistoryList, ImportExcel },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      innerColumns,
      dataSource: [],
      deviceTypeList: [],
      isSearch: 0,
      isExportLod: false,
      editData: [],
      isOut: false,
      isForm: false,
      expandedRowKeys: [],
      isHistory: false,
      isBorrowed: false,
      isImportExcel: false,
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.searchBtn();
  },
  methods: {
    splitData,
    history(record) {
      this.editData = record;
      this.isHistory = true;
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.searchBtn();
    },
    borrowed(record, flag) {
      this.isForm = true;
      this.isOut = flag;
      this.editData = record;
      console.log(" this.isEdit===", this.isOut);
    },
    closeModal() {
      this.isForm = false;
      this.isHistory = false;
      this.isImportExcel = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
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
            filename: values.filename,
            no: values.no,
            fileno: values.fileno,
            status: values.status,
          };
          getBorrowedSop(params, "get").then((res) => {
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
    exportExcel() {
      let values = this.searchForm.getFieldsValue();
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        filename: values.filename,
        no: values.no,
        fileno: values.fileno,
        status: values.status,
      };
      getBorrowedSop(params, "get").then((res) => {
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
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `灯板钢网借还登记_${timestamp}.xlsx`);
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
/deep/.ant-table:nth-of-type(0) {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
