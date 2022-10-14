<template>
    <div>
      <a-spin tip="导出中..." :spinning="isExportLod">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-form layout="horizontal" :form="searchForm">
            <div :class="advanced ? null : 'fold'">
              <a-row>
                <a-col :md="6" :sm="24">
                  <a-form-item label="工号/姓名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input style="width: 200px" placeholder="请输入工号/姓名" v-decorator="['keyword']" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <span style="display: flex;justify-content: flex-end;">
              <a-button type="primary" @click="searchBtn">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-form>
          <div class="operator">
            <!-- <a-button type="primary" @click="add" icon="plus" :disabled="!hasPerm('add')">新增</a-button> -->
            <!-- <a-button type="primary" style="margin-left: 8px" :disabled="!hasPerm('bind')" @click="bind" icon="deployment-unit">绑定设备</a-button>
              <a-button :disabled="!hasPerm('export')" style="margin-left: 8px" type="primary" @click="exportExcel" icon="export">导出</a-button> -->
            <!-- <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span> -->
          </div>
          <a-table
            :columns="columns"
            :data-source="dataSource"
            size="small"
            :scroll="{ y: scrollY }"
            :loading="loading"
            :pagination="pagination"
            @change="handleTableChange"
            :rowKey="(dataSource) => dataSource.ConfigId"
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
                <a style="margin-right: 8px" @click="add(record)" :disabled="!hasPerm('edit')">
                  <a-icon type="plus" />
                  添加权限
                </a>
              </div>
            </template>
          </a-table>
        </a-card>
        <serveForm v-if="isForm" :userData="userData" @closeModal="closeModal" @success="searchBtn" />
      </a-spin>
    </div>
  </template>
  
  <script>
  import { getPermission } from "@/services/srm.js";
  import { renderStripe } from "@/utils/stripe.js";
  import getTableScroll from "@/utils/setTableHeight";
  import { splitData } from "@/utils/util.js";
  import { PublicVar } from "@/mixins/publicVar.js";
  import { columns } from "./data/data";
  import serveForm from "./components/useForm.vue";
  export default {
    mixins: [PublicVar],
    components: { serveForm },
    data() {
      return {
        scrollY: "",
        advanced: true,
        columns,
        dataSource: [],
        isSearch: 0,
        isExportLod: false,
        userData: [],
        isForm: false,
        selectedRowKeys: [],
        plantList: [],
        workshopList: [],
        plantId: "",
        LineList: [],
        paramsList: [],
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
        this.search();
      },
      add(record){
          this.isForm =true;
          this.userData = record;
      },
      closeModal() {
        this.isForm = false;
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
            let params = {
              pageindex: this.pagination.current,
              pagesize: this.pagination.pageSize,
              keyword: values.keyword,
            };
            getPermission(params, "enterprise/get").then((res) => {
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
    },
  };
  </script>
  
  <style scoped lang="less">
  .ant-table {
    min-height: 62vh;
  }
  .ant-form-item {
    margin-bottom: 5px;
  }
  </style>
  