<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2022-10-31 14:47:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/instrument/index.vue
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
                <a-form-item label="证书编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入证书编码" v-decorator="['certcode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入设备名称" v-decorator="['instrumentname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="制造商" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入制造商" v-decorator="['manufacturer']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入型号" v-decorator="['instrumentcode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="固定资产编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入固定资产编号" v-decorator="['propertycode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="出厂编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入出厂编号" v-decorator="['factoryno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="使用部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入使用部门" v-decorator="['usedepartment']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="使用区域" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入使用区域" v-decorator="['usearea']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="计划校准月份" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-month-picker @change="onChange" style="width: 200px" allowClear placeholder="请输入送样采购员" v-decorator="['plancalimonth']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="校准方式" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入校准方式" v-decorator="['calibrateway']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="导入日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="更新日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
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
          <a-button v-if="hasPerm('import')" icon="import" type="primary" :loading="loading" @click="importExcel(1)" style="margin-left: 8px">首次导入</a-button>
          <a-button v-if="hasPerm('import')" icon="import" type="primary" :loading="loading" @click="importExcel(2)" style="margin-left: 8px">覆盖导入</a-button>
          <a-button v-if="hasPerm('import')" icon="download" type="primary" :loading="loading" @click="downExcel = true" style="margin-left: 8px">下载首次导入模板</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="exportExcel" icon="export">导出</a-button>
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
          :scroll="{ y: scrollY, x: 2000 }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          @change="handleTableChange"
          :rowClassName="tableRowClassName"
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
              <a-tag color="green" v-if="record == 'ok'">{{ record }}</a-tag>
              <a-tag color="red" v-else>{{ record }}</a-tag>
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
            </div>
          </template>
        </a-table>
      </a-card>
      <ImportExcel v-if="isImportExcel" :importType="importType" @closeModal="closeModal" :enterList="enterList" @success="searchBtn" />
    </a-spin>
  </div>
</template>

<script>
import { getInstrument, setInstrument } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import ImportExcel from "./ImportExcel.vue";
import ExportExcel from "@/utils/ExportExcelJS";
export default {
  mixins: [PublicVar],
  components: { ImportExcel },
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
      importType: 1,
      month: "",
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
    downExcel() {
      window.open("./Upload/EAP/import/设备配置模板.xlsx", "_blank");
    },
    //重置搜索
    reset() {
      this.month = "";
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
    onChange(date, dateString) {
      console.log(date, dateString);
      this.month = dateString;
    },
    getEnterList() {
      let params = {
        entertypecode: "COMPANY",
      };
      getInstrument(params, "getenterlist").then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
          this.enterId = this.enterList[0].EnterId;
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterId,
          });
          this.searchBtn();
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
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
        console.log("values===", values);
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] != undefined) {
            var importdatestart = values["range-time-picker"][0].format("YYYY-MM-DD");
            var importdateend = values["range-time-picker"][1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker1"] != undefined) {
            var updatedatestart = values["range-time-picker"][0].format("YYYY-MM-DD");
            var updatedateend = values["range-time-picker"][1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            certcode: values.certcode,
            instrumentname: values.instrumentname,
            manufacturer: values.manufacturer,
            instrumentcode: values.instrumentcode,
            propertycode: values.propertycode,
            factoryno: values.factoryno,
            usedepartment: values.usedepartment,
            usearea: values.usearea,
            plancalimonth: this.month,
            calibrateway: values.calibrateway,
            importdatestart: importdatestart,
            importdateend: importdateend,
            updatedatestart: updatedatestart,
            updatedateend: updatedateend,
          };
          getInstrument(params, "getinstrumentlist").then((res) => {
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
    onDelete(item) {
      let params = {
        Ids: [],
      };
      params.Ids.push({ id: item.Id });
      setInstrument(params, "deleteinstrument").then((res) => {
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
          let params = {
            Ids: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.Ids.push({ id: item });
          });
          setInstrument(params, "deleteinstrument").then((res) => {
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
    importExcel(type) {
      this.isImportExcel = true;
      this.importType = type;
    },
    tableRowClassName(record) {
      if (record.DaysRemaining <= 0) {
        return "blue";
      }
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] != undefined) {
        var importdatestart = values["range-time-picker"][0].format("YYYY-MM-DD");
        var importdateend = values["range-time-picker"][1].format("YYYY-MM-DD");
      }
      if (values["range-time-picker1"] != undefined) {
        var updatedatestart = values["range-time-picker"][0].format("YYYY-MM-DD");
        var updatedateend = values["range-time-picker"][1].format("YYYY-MM-DD");
      }
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: values.enterpriseid,
        certcode: values.certcode,
        instrumentname: values.instrumentname,
        manufacturer: values.manufacturer,
        instrumentcode: values.instrumentcode,
        propertycode: values.propertycode,
        factoryno: values.factoryno,
        usedepartment: values.usedepartment,
        usearea: values.usearea,
        plancalimonth: this.month,
        calibrateway: values.calibrateway,
        importdatestart: importdatestart,
        importdateend: importdateend,
        updatedatestart: updatedatestart,
        updatedateend: updatedateend,
      };
      getInstrument(params, "getinstrumentlist").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item, index) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(",");
              }
            });
            item.index = index + 1;
            return item;
          });
          const header = [];
          columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          header.unshift({ key: "index", title: "序号" });
          header.push({ key: "Id", title: "ID" });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `需校准仪器_${timestamp}.xlsx`);
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
/deep/.ant-table-tbody .blue {
  background-color: #fd5454 !important;
  color: #000;
}
</style>
