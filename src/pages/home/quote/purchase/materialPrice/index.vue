<!--
 * @Author: max
 * @Date: 2022-02-14 16:45:41
 * @LastEditTime: 2023-06-23 10:13:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/materialPrice/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <div :class="advanced ? 'search' : null" style="margin-bottom: 8px">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select
                    placeholder="请选择生产工厂"
                    mode="multiple"
                    v-decorator="[
                      'plantid',
                      {
                        rules: [{ required: true, message: '请选择生产工厂' }],
                      },
                    ]"
                  >
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input
                    placeholder="请输入产品品号"
                    allowClear
                    v-decorator="[
                      'itemcode',
                      {
                        rules: [{ required: true, message: '请输入产品品号' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="display: flex;justify-content: flex-end">
            <a-button type="primary" :disabled="!hasPerm('search')" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" :disabled="!hasPerm('search')" @click="reset">重置</a-button>
          </span>
        </a-form>
      </div>
      <div>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="StatusCheck" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record == 'Y'">已审核</a-tag>
              <a-tag color="red" v-else>未审核</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a style="margin-right: 8px" @click="details(record.Id)">
                <a-icon type="profile" />
                详情
              </a>
              <a style="margin-right: 8px" @click="handleExcel(record.Id, record.ItemCode)">
                <a-icon type="export" />
                导出
              </a>
              <a style="margin-right: 8px" @click="history(record)">
                <a-icon type="history" />
                历史版本
              </a>
            </div>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "3%",
  },
  {
    title: "工厂名称",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "供应商名称",
    dataIndex: "SupplierName",
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    align: "center",
  },
  {
    title: " 规格",
    dataIndex: "ItemSpecification",
    align: "center",
    width: "20%",
  },
  {
    title: "单价",
    dataIndex: "Price1",
    align: "center",
  },
  {
    title: "单价来源",
    dataIndex: "From1",
    align: "center",
  },
];
import { getDemandEnter, getCostConfig } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
export default {
  props: ["categoryList"],
  data() {
    return {
      loading: false,
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      plantList: [],
      enterList: [],
      form: [],
      searchForm: this.$form.createForm(this),
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      plantid: "",
      enterpriseid: "",
      scrollY: "",
      isDetails: false,
      detailsId: "",
      selectedRowKeys: [],
      status: "Y",
      isHistory: false,
      historyData: [],
      historyType: "",
      isSearch: false,
      exportData: [],
      isBatchBom: false,
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getDemandEnter();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    //重置
    //重置搜索
    reset() {
      this.getDemandEnter();
      this.searchForm.resetFields();
    },
    closeHistory() {
      this.isHistory = false;
    },
    history(item) {
      this.isHistory = true;
      this.historyData = item;
    },
    //批量查询
    batchSearch() {
      this.isBatchBom = true;
    },
    //获取需求公司
    getDemandEnter() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getDemandEnter(params1).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
          this.searchForm.setFieldsValue({
            plantid: [this.plantList[0].EnterId],
          });
        }
      });
    },
    //搜素
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.dataSource = [];
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid.join(","),
            itemcode: values.itemcode || "",
          };
          getCostConfig(params, "getmaterialpricedetail").then((res) => {
            if (res.data.success) {
              console.log(res.data.data);
              if (!res.data.data) {
                this.loading = false;
                return;
              }
              this.dataSource = res.data.data.MaterialInfo;
              const pagination = { ...this.pagination };
              pagination.total = this.dataSource.length;
              this.pagination = pagination;
              this.isSearch = true;
            } else {
              this.dataSource = [];
              this.pagination.current = 1;
              this.pagination.total = 0;
            }
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      });
    },
    //分页按钮
    handleTableChange(pagination) {
      this.selectedRowKeys = [];
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 60vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
