<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2022-05-18 11:00:53
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/registration/registration.vue
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
                  <a-select v-decorator="['enterpriseid']" placeholder="请选择公司名称" @change="enterChange">
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
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="发起日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">
          <a-button type="primary" @click="exportExcel" icon="export">导出</a-button>
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
          :scroll="{ y: scrollY, x: 3500 }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.RegisterId"
          bordered
        >
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
              <a-popconfirm v-if="rolesign == 'ADMIN'" title="确定删除?" @confirm="() => onDelete(record)">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px" v-if="rolesign == 'ADMIN'" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
              <a style="margin-right: 8px" @click="schedule(record.RegisterId)" :disabled="!hasPerm('edit')">
                <a-icon type="container" />
                查看进度
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <useForm v-if="isForm" :isEdit="isEdit" :editData="editData" :enterList="enterList" @closeModal="closeModal" @success="getListAll" />
      <schedule v-if="isSchedule" :registerid="registerid" @closeModal="closeModal" />
    </a-spin>
  </div>
</template>

<script>
import { getDepartmentApi, setDepartmentApi, getMaterialSampleApi } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
// import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import useForm from "./form.vue";
import schedule from "./schedule.vue";
import { exportjsontoexcel } from "@/utils/Export2ExcelJs";
export default {
  props: ["rolesign"],
  mixins: [PublicVar],
  components: { useForm, schedule },
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
      innerData: [],
      expandedRowKeys: [],
      defaultExpandedRowKeys: [],
      departmentalList: [],
      isSchedule: false,
      registerid: "",
    };
  },
  updated() {
    renderStripe();
  },
  watch: {
    rolesign(res) {
      this.rolesign = res;
    },
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = this.getTableScroll(70);
    });
    this.getEnterList();
    var str = "AA";
    str.charCodeAt();
    console.log(str.charCodeAt());
  },
  methods: {
    splitData,
    getTableScroll(extraHeight = 70, id) {
      if (typeof extraHeight == "undefined") {
        //  默认底部分页64 + 边距10
        extraHeight = 70;
      }
      let tHeader = null;
      if (id) {
        tHeader = document.getElementById(id) ? document.getElementById(id).getElementsByClassName("ant-table-thead")[0] : null;
      } else {
        tHeader = document.getElementsByClassName("ant-table-thead")[0];
      }
      //表格内容距离顶部的距离
      // console.log("tHeader", tHeader);
      let tHeaderBottom = 0;
      let tHeaderTop = 0;
      if (tHeader) {
        tHeaderBottom = tHeader.getBoundingClientRect().bottom;
        tHeaderTop = tHeader.getBoundingClientRect().top;
      }
      // let height = document.body.clientHeight - tHeaderBottom - extraHeight
      let height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`;
      let height1 = `calc(100vh - ${tHeaderTop + extraHeight}px)`;
      // document.getElementsByClassName("ant-table")[0].style.maxHeight = `calc(100vh - ${tHeaderBottom}px)`;
      // document.getElementsByClassName("ant-table")[0].style.mixHeight = `calc(100vh - ${tHeaderBottom}px)`;
      const table = document.getElementsByClassName("ant-table")[0];
      table.style.minHeight = height1;
      // console.log(table);
      console.log("height", height);
      return height;
    },
    schedule(id) {
      this.isSchedule = true;
      this.registerid = id;
    },

    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.getListAll();
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
    },
    closeModal() {
      this.isForm = false;
      this.isImport = false;
      this.isSchedule = false;
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
          this.getListAll();
        }
      });
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
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterId,
        departmentid: this.departmentid,
        tablestatus: "",
        createdatestart: "",
        createdateend: "",
      };
      getDepartmentApi(parmas, "getregisterlist").then((res) => {
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
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] != undefined) {
            var createdatestart = this.formatDateTime(values["range-time-picker"][0]);
            var createdateend = this.formatDateTime(values["range-time-picker"][1]);
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            departmentid: values.departmentid || "",
            tablestatus: values.tablestatus || "",
            createdatestart: createdatestart || "",
            createdateend: createdateend || "",
          };
          getDepartmentApi(parmas, "getregisterlist").then((res) => {
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
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          let params = {
            RegisterList: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.RegisterList.push({
              RegisterId: item,
            });
          });
          setDepartmentApi(params, "deleteregister").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = {
        RegisterList: [
          {
            RegisterId: item.RegisterId, //部门ID
          },
        ],
      };
      setDepartmentApi(parmas, "deleteregister").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
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
        var createdatestart = this.formatDateTime(values["range-time-picker"][0]);
        var createdateend = this.formatDateTime(values["range-time-picker"][1]);
      }
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        enterpriseid: values.enterpriseid,
        departmentid: values.departmentid || "",
        tablestatus: values.tablestatus || "",
        createdatestart: createdatestart || "",
        createdateend: createdateend || "",
      };
      getDepartmentApi(parmas, "getregisterlist").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          list.map((item) => {
            let array = [];
            this.columns.map((items) => {
              if (items.dataIndex) {
                array.push(item[items.dataIndex]);
              }
            });
            _data.push(array);
          });
          try {
            console.log(_data);
            exportjsontoexcel({ data: _data, filename: `登记汇总_.xlsx` });
            this.$message.success("导出数据成功!");
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
</style>
