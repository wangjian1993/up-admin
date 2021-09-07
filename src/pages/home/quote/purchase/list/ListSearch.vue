<!--
 * @Author: max
 * @Date: 2021-09-07 15:05:20
 * @LastEditTime: 2021-09-07 16:39:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/ListSearch.vue
-->
<template>
  <div>
    <div>
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="需求公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select
                    placeholder="请选择需求公司"
                    v-decorator="[
                      'enterpriseid',
                      {
                        rules: [{ required: true, message: '请选择需求公司' }],
                      },
                    ]"
                  >
                    <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select
                    placeholder="请选择生产工厂"
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
                <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select placeholder="请选择" v-decorator="['statuscheck']">
                    <a-select-option value="Y">已审核</a-select-option>
                    <a-select-option value="N">未审核</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品大类" v-decorator="['ItemSort']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品名" v-decorator="['itemname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品号" v-decorator="['itemcode']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>
    </div>
    <div>
      <a-space class="operator">
        <a-button type="primary" icon="check-circle">审批</a-button>
        <a-button icon="copy">复制发布</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <!-- <a-menu-item key="audit">审批</a-menu-item> -->
          </a-menu>
          <a-button> 更多操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </a-space>
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" bordered>
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
            <a-popconfirm v-if="record.StatusCheck == 'N'" title="确定审核?" @confirm="() => onAudit(record)">
              <a style="margin-right: 8px">
                <a-icon type="check-circle" />
                审核
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px">
              <a-icon type="copy" />
              复制
            </a>
            <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
              <a style="margin-right: 8px">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
  },
  {
    title: "需求公司",
    dataIndex: "EnterpriseName",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
  },
  {
    title: "产品大类",
    dataIndex: "ItemSort",
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
  },
  {
    title: "品名",
    dataIndex: "ItemName",
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
  },
  {
    title: "物料成本",
    dataIndex: "MaterialCost",
  },
  {
    title: "最终成本",
    dataIndex: "FinalCost",
  },
  {
    title: "状态",
    dataIndex: "StatusCheck",
    scopedSlots: { customRender: "StatusCheck" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
import { getDemandEnter, getCostConfig, addCost } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
export default {
  data() {
    return {
      loading: true,
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
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
      console.log(this.scrollY);
    });
    this.getDemandEnter();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    //获取需求公司
    getDemandEnter() {
      let parmas = {
        entertypecode: "COMPANY",
      };
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDemandEnter(parmas).then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
          this.enterpriseid = this.enterList[0].EnterId;
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterList[0].EnterId,
          });
        }
      });
      getDemandEnter(parmas1).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].EnterId,
          });
          this.getCostList();
        }
      });
    },
    getCostList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterpriseid,
        plantid: this.plantid,
        statuscheck: "",
        itemsort: "",
        itemcode: "",
        itemname: "",
      };
      getCostConfig(parmas, "getquotelist").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          console.log(this.dataSource);
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            plantid: values.plantid,
            statuscheck: values.statuscheck,
            itemsort: values.itemsort || "",
            itemcode: values.itemcode || "",
            itemname: values.itemname || "",
          };
          getCostConfig(parmas, "getquotelist").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //审核
    onAudit(item) {
      let parmas = {
        Id: item.Id,
        StatusCheck: item.StatusCheck == "Y" ? "N" : "Y",
      };
      addCost(parmas, "checkquote").then((res) => {
        if (res.data.success) {
          this.$message.success("审核成功!");
          this.getCostList();
        }
      });
    },
    //删除
    onDelete(item) {
      let parmas = {
        Id: item.Id,
        IsDelete: "Y",
      };
      addCost(parmas, "deletequote").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getCostList();
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getCostList();
    },
  },
};
</script>

<style scoped></style>
