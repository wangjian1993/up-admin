<!--
 * @Author: max
 * @Date: 2022-04-08 08:55:36
 * @LastEditTime: 2023-06-20 14:42:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/editProcess/outbound.vue
-->
<template>
    <div>
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="工序" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['process']" style="width: 200px" placeholder="请选择工序">
                    <a-select-option v-for="item in procedure" :key="item.Id" :value="item.Id">{{ item.ProcessName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['proname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['procode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="工单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入工单号" v-decorator="['mocode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="出站报工日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
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
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.ReportId"
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
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                修改
              </a>
            </div>
          </template>
        </a-table>
        <useForm v-if="isEdit" :editData="editData" @closeModal="closeModal" @succeed="searchBtn" />
      </a-card>
    </div>
  </template>
  
  <script>
  import { getProcess, editProductionF ,getEditProductionF } from "@/services/mes.js";
  import { renderStripe } from "@/utils/stripe.js";
  import getTableScroll from "@/utils/setTableHeight";
  import { splitData } from "@/utils/util.js";
  import { PublicVar } from "@/mixins/publicVar.js";
  import { columns } from "./outbound";
  import useForm from "./outForm.vue";
  export default {
    mixins: [PublicVar],
    components: { useForm },
    data() {
      return {
        scrollY: "",
        advanced: true,
        columns,
        dataSource: [],
        isDrawer: false,
        plantList: [],
        plantid: "",
        editData: [],
        isEdit: false,
        procedure:[]
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
      this.getPlant();
      this.plantChange();
    },
    methods: {
      splitData,
      getPlant() {
        let params1 = {
          entertypecode: "PLANT",
        };
        getProcess(params1, "getlistbytypecode").then((res) => {
          if (res.data.success) {
            this.plantList = res.data.data;
          }
        });
      },
      plantChange() {
        let params = {
          pageindex: 1,
          pagesize: 100,
        };
        getProcess(params, "getall").then((res) => {
          if (res.data.success) {
            this.procedure = res.data.data.list;
          }
        });
      },
      //重置搜索
      reset() {
        this.isSearch = 0;
        this.searchForm.resetFields();
        this.searchBtn();
      },
      closeModal() {
        this.isEdit = false;
      },
      edit(item) {
        this.isEdit = true;
        this.editData = item;
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
              var startdate = rangeValue[0].format("YYYY-MM-DD");
              var enddate = rangeValue[1].format("YYYY-MM-DD");
            }
            let params = {
              pageindex: this.pagination.current,
              pagesize: this.pagination.pageSize,
              mocode: values.mocode,
              plantid: values.plantid,
              process: values.process,
              procode: values.procode,
              proname: values.proname,
              startdate: startdate,
              enddate: enddate,
            };
            getEditProductionF(params, "getall").then((res) => {
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
            editProductionF(self.selectedRowKeys, "delete").then((res) => {
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
        let params = [];
        params.push(item.ReportId);
        editProductionF(params, "delete").then((res) => {
          if (res.data.success) {
            this.$message.success("删除成功!");
            this.search();
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
  