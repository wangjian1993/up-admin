<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-03-01 08:54:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/report/index.vue
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
                  <a-select v-decorator="['enterpriseid']" placeholder="请选择公司名称">
                    <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="订单日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="采购订单" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入采购订单" v-decorator="['docno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['itemcode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['itemname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入规格" v-decorator="['itemspecification']" />
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
                <a-form-item label="供应商名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商名称" v-decorator="['suppliername']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="采购员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入送样采购员" v-decorator="['purchaser']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="签样状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select style="width: 200px" disabled v-decorator="['isqy']" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="是">是</a-select-option>
                    <a-select-option value="否">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
               <a-col :md="6" :sm="24">
                <a-form-item label="交易次数" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input-number :min="0" style="width: 80px" allowClear placeholder="请输入开始数量" v-decorator="['transtimesstart']" />
                  <span>~</span>
                   <a-input-number :min="0" style="width: 80px" allowClear placeholder="请输入结束数量" v-decorator="['transtimesend']" />
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
          <a-button v-if="hasPerm('import')" icon="import" type="primary" :loading="loading" @click="isImportExcel = true" style="margin-left: 8px">导入</a-button>
          <a-button type="primary" style="margin-left: 8px" :disabled="dataSource.length == 0" @click="exportExcel" icon="export">导出</a-button>
          <!-- <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allApprove" style="margin-left: 8px">批量审批</a-button> -->
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
          @change="handleTableChange"
          :rowKey="(dataSource, index) => dataSource.ItemCode + '_' + index"
          bordered
        >
          <!-- <a-table slot="expandedRowRender" size="small" :columns="innerColumns" :data-source="innerData" :pagination="false">
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ index + 1 }}</span>
              </div>
            </template>
            <template slot="ReceiverList" slot-scope="record">
              <div>
                <a-tag v-for="item in record" :key="item.ReceiverId">
                  {{ item.ReceiverName }}
                </a-tag>
              </div>
            </template>
          </a-table> -->
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="IsQy" slot-scope="text">
            <div>
              <a-tag color="green" v-if="text == '是'">{{ text }}</a-tag>
              <a-tag color="red" v-else>{{ text }}</a-tag>
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
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
              <a style="margin-right: 8px" @click="schedule(record.RegisterId)" :disabled="!hasPerm('look')">
                <a-icon type="container" />
                查看进度
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getDepartmentApi, getMaterialSampleApi } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data";
import { exportjsontoexcel } from "@/utils/Export2ExcelJs";
export default {
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      deviceTypeList: [],
      isSearch: 0,
      isExportLod: false,
      editData: [],
      isEdit: false,
      isForm: false,
      selectedRowKeys: [],
      enterList: [],
      enterId: "",
      isImportExcel: false,
      departmentalList: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    console.log(this.$store.state);
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getEnterList();
  },
  methods: {
    splitData,
    schedule(id) {
      this.isSchedule = true;
      this.registerid = id;
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.getEnterList();
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.isEditBnt = true;
      console.log("record====", record);
      this.editData = record;
    },
    closeModal() {
      this.isImportExcel = false;
    },
    enterChange(e) {
      let params = {
        enterpriseid: e,
      };
      getMaterialSampleApi(params, "getdeptoptions").then((res) => {
        if (res.data.success) {
          this.departmentalList = res.data.data;
        }
      });
    },
    getEnterList() {
      let params = {
        entertypecode: "COMPANY",
      };
      getMaterialSampleApi(params, "getenterlist").then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
          this.enterId = this.enterList[0].EnterId;
          this.enterChange(this.enterId);
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterId,
          });
          this.search();
        }
      });
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
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] != undefined) {
            var createdatestart = values["range-time-picker"][0].format("YYYY-MM-DD");
            var docdateend = values["range-time-picker"][1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            docdatestart: createdatestart,
            docdateend: docdateend,
            docno: values.docno,
            itemcode: values.itemcode,
            itemname: values.itemname,
            itemspecification: values.itemspecification,
            drawingno: values.drawingno,
            purchaser: values.purchaser,
            suppliercode: values.suppliercode,
            suppliername: values.suppliername,
            isqy: values.isqy,
            transtimesstart: values.transtimesstart,
            transtimesend: values.transtimesend,
          };
          getDepartmentApi(params, "firstpurchaseqyreport").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            } else {
              this.dataSource = [];
              const pagination = { ...this.pagination };
              pagination.total = 0;
              this.pagination = pagination;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let _data = [];
      const header = [];
      this.columns.map((item) => {
        if (item.dataIndex) {
          header.push(item.title);
        }
      });
      _data.push(header);
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] != undefined) {
        var createdatestart = values["range-time-picker"][0].format("YYYY-MM-DD");
        var docdateend = values["range-time-picker"][1].format("YYYY-MM-DD");
      }
      let params = {
        pageindex: this.pagination.current,
        pagesize: 30000,
        enterpriseid: values.enterpriseid,
        docdatestart: createdatestart,
        docdateend: docdateend,
        docno: values.docno,
        itemcode: values.itemcode,
        itemname: values.itemname,
        itemspecification: values.itemspecification,
        drawingno: values.drawingno,
        purchaser: values.purchaser,
        suppliercode: values.suppliercode,
        suppliername: values.suppliername,
        isqy: values.isqy,
      };
      getDepartmentApi(params, "firstpurchaseqyreport").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list
          list.map((item) => {
            let array = [];
            this.columns.map((items) => {
              if (items.dataIndex) {
                array.push(item[items.dataIndex] || "");
              }
            });
            _data.push(array);
          });
          try {
            console.log(_data);
            exportjsontoexcel({ data: _data, filename: `首次采购要签样报表.xlsx` });
            this.$message.success("导出数据成功!");
            this.selectedRowKeys = [];
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
/deep/.ant-table:nth-of-type(0) {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.Rowactive > td {
  // background-color: #ed0e0e !important;
  color: #f60e0e !important;
}
</style>
