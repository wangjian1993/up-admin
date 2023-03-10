<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-03-01 15:02:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/document/index.vue
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
                <a-form-item label="发起部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['departmentid']" placeholder="请选择发起部门">
                    <a-select-option v-for="item in departmentalList" :key="item.Id" :value="item.Id">{{ item.DepartmentName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['tablestatus']" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="已完结">已完结</a-select-option>
                    <a-select-option value="未完结">未完结</a-select-option>
                    <a-select-option value="已作废">已作废</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="发起日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
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
                <a-form-item label="供应商" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入供应商" v-decorator="['supplier']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="送样采购员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入送样采购员" v-decorator="['purchaser']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="文控操作时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }"> <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" /> </a-form-item
              ></a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a-popover v-model="poped" trigger="click" placement="leftBottom">
              <template slot="title">
                <a-checkbox :checked="chkAll" :indeterminate="indeterminate" @change="ckAllChange">全部</a-checkbox>
              </template>
              <template slot="content">
                <a-checkbox-group v-model="ckValues" :options="columnList" @change="ckChange" style="width: 150px;">
                  <span slot="label" :title="option.title" slot-scope="option">{{ option.title }}</span>
                </a-checkbox-group>
                <a-divider style="margin:5px; " />
                <a-space>
                  <a-button type="primary" size="small" @click="createColumns">确认</a-button>
                  <a-button type="primary" size="small" @click="poped = false">取消</a-button>
                </a-space>
              </template>
              <a-button type="primary" style="margin:0 10px;" icon="table" shape="circle" />
            </a-popover>
          </span>
        </a-form>
        <div class="operator">
          <a-button v-if="hasPerm('import')" icon="import" type="primary" :loading="loading" @click="isImportExcel = true" style="margin-left: 8px">导入</a-button>
          <a-button type="primary" style="margin-left: 8px" :disabled="selectedRowKeys.length == 0" @click="exportExcel" icon="export">导出</a-button>
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
          :scroll="{ y: scrollY, x: 4000 }"
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
          <template slot="Enable" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a v-if="record.TableStatus != '已作废'" style="margin-right: 8px" @click="rollback(record.Id)">
                完结后回退
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <ImportExcel v-if="isImportExcel" @closeModal="closeModal" :enterList="enterList" @success="getListAll" />
      <Cause v-if="isCause" @closeModal="closeModal" @success="success" />
    </a-spin>
  </div>
</template>

<script>
import { getDepartmentApi, getMaterialSampleApi ,setDepartmentApi } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columnsData, innerColumns } from "./data";
import ImportExcel from "./ImportExcel.vue";
import { exportjsontoexcel } from "@/utils/Export2ExcelJs";
import Cause from "./cause.vue";
export default {
  mixins: [PublicVar],
  components: { ImportExcel, Cause },
  data() {
    return {
      scrollY: "",
      ckValues: [], //checkgroup设置值
      chkAll: true, //全选
      indeterminate: false, //模糊状态
      advanced: true,
      poped:false,
      columns: [], //显示列
      columnList: columnsData, //全部列
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
      isCause: false,
      RegisterId: "",
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(100);
      let local = JSON.parse(localStorage.getItem("STANDING_BOOK_COLUMN"));
      this.columnList.forEach((col) => {
        col.value = col.dataIndex; //设置value值，用于checkedgroup
      });
      if (local) {
        this.ckValues = [];
        local.forEach((col) => {
          this.ckValues.push(col.value);
        });
        console.log("this.ckValues===",this.ckValues)
      } else {
        this.createChGroupValue(); //初始全部选中
      }
      this.createColumns(); //生成显示列
      // this.setDelCol(); //设置删除标记列的显示样式
      let primaryKey = this.columns.find((f) => f.primaryKey == true);
      if (primaryKey) {
        this.primaryKey = primaryKey.dataIndex;
      }
    });
    this.getEnterList();
  },
  methods: {
    splitData,
    createChGroupValue() {
      this.ckValues = [];
      this.columnList.forEach((col) => {
        this.ckValues.push(col.value);
      });
    },
    ckChange(checkedList) {
      // console.log("checkedList===", this.columnList);
      this.indeterminate = !!checkedList.length && checkedList.length < this.columnList.length;
      this.chkAll = checkedList.length === this.columnList.length;
    },
    ckAllChange(e) {
      this.chkAll = e.target.checked;
      this.indeterminate = false;
      if (this.chkAll) {
        this.createChGroupValue();
      } else {
        this.ckValues = [];
      }
    },
    createColumns() {
      if (this.ckValues.length == 0) {
        this.$message.error("请至少留下一列");
        return;
      }
      this.columns = [];
      this.ckValues.forEach((item) => {
        let col = this.columnList.find((f) => f.dataIndex == item);
        // console.log("col===", col);
        if (col) {
          this.columns.push(col);
        }
      });
      this.poped = false;
      localStorage.setItem("STANDING_BOOK_COLUMN", JSON.stringify(this.columns));
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
      this.isCause = false;
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
    rollback(id) {
      this.isCause = true;
      this.RegisterId = id;
    },
    success(form) {
      let params = {
        RegisterId: this.RegisterId,
        ReturnReason: form.ReturnReason,
      };
      setDepartmentApi(params, "returnflowpointpostwk").then((res) => {
        if (res.data.success) {
          this.isCause = false;
          this.searchBtn();
          this.$message.success("回退成功!");
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
    //获取列表
    getListAll() {
      this.loading = true;
      // if (values["range-time-picker"] != undefined) {
      //   var createdatestart = values["range-time-picker"][0].format("YYYY-MM-DD");
      //   var docdateend = values["range-time-picker"][1].format("YYYY-MM-DD");
      // }
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterId,
        departmentid: "",
        tablestatus: "",
        itemcode: "",
        itemname: "",
        itemspecification: "",
        supplier: "",
        purchaser: "",
        dthandlerwkstart: "",
        dthandlerwkend: "",
      };
      getDepartmentApi(params, "getallregisterlistwk").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
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
            var createdateend = values["range-time-picker"][1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] != undefined) {
            var dthandlerwkstart = values["range-time-picker2"][0].format("YYYY-MM-DD");
            var dthandlerwkend = values["range-time-picker2"][1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            departmentid: values.departmentid || "",
            tablestatus: values.tablestatus || "",
            createdatestart: createdatestart || "",
            createdateend: createdateend || "",
            itemcode: values.itemcode || "",
            itemname: values.itemname || "",
            itemspecification: values.itemspecification || "",
            supplier: values.supplier || "",
            purchaser: values.purchaser || "",
            dthandlerwkstart: dthandlerwkstart || "",
            dthandlerwkend: dthandlerwkend || "",
          };
          getDepartmentApi(params, "getallregisterlistwk").then((res) => {
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
      let list = [];
      this.dataSource.forEach((item, index) => {
        if (this.selectedRowKeys.includes(item.ItemCode + "_" + index)) {
          list.push(item);
        }
      });
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
        exportjsontoexcel({ data: _data, filename: `登记汇总_.xlsx` });
        this.$message.success("导出数据成功!");
        this.selectedRowKeys = [];
      } catch (error) {
        console.log(error);
        this.$message.error("导出数据失败");
      }
      this.isExportLod = false;
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
/deep/.ant-ant-popover-content {
  width:300px;
}
</style>
