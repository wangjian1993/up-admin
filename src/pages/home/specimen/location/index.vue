<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-07-07 15:41:36
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/location/index.vue
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
                    <a-select-option value="ALL">全部</a-select-option>
                  </a-select>
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
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商" v-decorator="['suppliername']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="签样时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="存放公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['storedcompany']" placeholder="请选择存放公司">
                    <a-select-option v-for="item in companyList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="存放位置" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入送样采购员" v-decorator="['storedlocation']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="OA是否作废" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['isoang']" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="Y">是</a-select-option>
                    <a-select-option value="N">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="是否从IQC回收签样" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['isiqcrecovery']" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="Y">是</a-select-option>
                    <a-select-option value="N">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="所回收的资料登记" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['recoveryinfo']" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="承认书">承认书</a-select-option>
                    <a-select-option value="样品">样品</a-select-option>
                    <a-select-option value="承认书和样品">承认书和样品</a-select-option>
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
          <a-button type="primary" @click="add" icon="plus">新增</a-button>
          <a-button v-if="hasPerm('import')" icon="import" type="primary" :loading="loading" @click="isImportExcel = true" style="margin-left: 8px">导入</a-button>
          <a-button icon="export" type="primary" :loading="loading" @click="exportExcel" style="margin-left: 8px">导出</a-button>
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
          :scroll="{ y: scrollY }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          @change="handleTableChange"
          :rowKey="(dataSource, index) => dataSource.Id"
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
          <template slot="Enable" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
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
            </div>
          </template>
        </a-table>
      </a-card>
      <ImportExcel v-if="isImportExcel" @closeModal="closeModal" :enterList="enterList" @success="searchBtn" />
      <useForm v-if="isForm" :isEdit="isEdit" :editData="editData" :enterList="enterList" @closeModal="closeModal" :companyList="companyList" @success="searchBtn" />
    </a-spin>
  </div>
</template>

<script>
import { getSpecimenLocation, getMaterialSampleApi, setSpecimenLocation } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import ImportExcel from "./ImportExcel.vue";
import ExportExcel from "@/utils/ExportExcelJS";
import useForm from "./form.vue";
export default {
  mixins: [PublicVar],
  components: { ImportExcel, useForm },
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
      isEdit: false,
      isForm: false,
      selectedRowKeys: [],
      enterList: [],
      enterId: "",
      isImportExcel: false,
      departmentalList: [],
      supplierList: [],
      companyList: [],
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
    this.getCompanyList();
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
      this.editData = record;
    },
    add() {
      this.isForm = true;
      this.isEdit = false;
    },
    closeModal() {
      this.isForm = false;
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
    getCompanyList() {
      getMaterialSampleApi("", "getallcompanylist").then((res) => {
        if (res.data.success) {
          this.companyList = res.data.data;
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
          if (values["range-time-picker"] != undefined) {
            var datetimesignstart = values["range-time-picker"][0].format("YYYY-MM-DD");
            var datetimesignend = values["range-time-picker"][1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            datetimesignstart: datetimesignstart || "",
            datetimesignend: datetimesignend || "",
            itemcode: values.itemcode || "",
            itemname: values.itemname || "",
            itemspecification: values.itemspecification || "",
            suppliername: values.suppliername || "",
            storedcompany: values.storedcompany || "",
            suppliercode: values.suppliercode || "",
            drawingno: values.drawingno || "",
            storedlocation: values.storedlocation || "",
            isoang: values.isoang || "",
            isiqcrecovery: values.isiqcrecovery || "",
            recoveryinfo: values.recoveryinfo || "",
          };
          getSpecimenLocation(params, "getlist").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = 2;
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
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          let params = {
            List: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.List.push({
              Id: item,
            });
          });
          setSpecimenLocation(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.search();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let params = {
        List: [
          {
            Id: item.Id, //部门ID
          },
        ],
      };
      setSpecimenLocation(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.search();
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] != undefined) {
        var datetimesignstart = values["range-time-picker"][0].format("YYYY-MM-DD");
        var datetimesignend = values["range-time-picker"][1].format("YYYY-MM-DD");
      }
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        enterpriseid: values.enterpriseid,
        datetimesignstart: datetimesignstart || "",
        datetimesignend: datetimesignend || "",
        itemcode: values.itemcode || "",
        itemname: values.itemname || "",
        itemspecification: values.itemspecification || "",
        suppliername: values.suppliername || "",
        storedcompany: values.storedcompany || "",
        suppliercode: values.suppliercode || "",
        drawingno: values.drawingno || "",
        storedlocation: values.storedlocation || "",
        isoang: values.isoang || "",
        isiqcrecovery: values.isiqcrecovery || "",
        recoveryinfo: values.recoveryinfo || "",
      };
      getSpecimenLocation(params, "getlist").then((res) => {
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
            ExportExcel(header, dataSource, `样品定位管理_${timestamp}.xlsx`);
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
/deep/.Rowactive > td {
  // background-color: #ed0e0e !important;
  color: #f60e0e !important;
}
</style>
