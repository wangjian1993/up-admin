<!--
 * @Author: max
 * @Date: 2021-08-30 13:39:50
 * @LastEditTime: 2021-09-10 15:29:23
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/material/leadIn.vue
-->
<template>
  <div>
    <a-form layout="horizontal">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="PMC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input
                placeholder="请输入PMC"
                allowClear
                style="width: 200px"
                v-decorator="[
                  'searcValue',
                  {
                    rules: [{ required: true, message: '请输入请输入PMC!' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="周" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-week-picker placeholder="选择周" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span style="float: right; margin-top: 3px;">
        <a-button type="primary">查询</a-button>
        <a-button style="margin-left: 8px">重置</a-button>
        <a-button style="margin-left: 8px" type="primary" @click="importExcel"><a-icon type="import" />导入</a-button>
        <a-button style="margin-left: 8px" type="primary"><a-icon type="download" />下载模板</a-button>
      </span>
    </a-form>
    <div class="operator">
      <a-button type="primary" icon="check">审批</a-button>
      <a-button>复制发布</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="delete">删除</a-menu-item>
          <a-menu-item key="audit">审批</a-menu-item>
        </a-menu>
        <a-button>
          更多操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      size="small"
      :scroll="{ y:'100%' }"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :rowKey="(data) => data.Id"
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
      <template slot="enable" slot-scope="record">
        <div>
          <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
          <a-tag color="red" v-else>禁用</a-tag>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
            <a style="margin-right: 8px">
              <a-icon type="delete" />
              删除
            </a>
          </a-popconfirm>
          <a style="margin-right: 8px" @click="edit(record)">
            <a-icon type="edit" />
            编辑
          </a>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看
          </a>
        </div>
      </template>
    </a-table>
    <import-execl v-if="isExecl" :plantArray="plantList" @closeModal="closeModal"></import-execl>
  </div>
</template>

<script>
import ImportExecl from "./ImportExecl.vue";
import getTableScroll from "@/utils/setTableHeight";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%"
  },
  {
    title: "计划批号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
  },
  {
    title: "导入人员",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "周",
    dataIndex: "Week",
    scopedSlots: { customRender: "Week" },
    align: "center",
    width: "5%"
  },
  {
    title: "导入时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "DateTimeCreated" },
    align: "center",
  },
  {
    title: "导入数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { renderStripe } from "@/utils/stripe.js";
import { getMitemrequirement, mitemrequirementAction } from "@/services/web.js";
export default {
  components: { ImportExecl },
  data() {
    return {
      data: [],
      columns,
      loading: true,
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
      selectedRows: [],
      plantList: [],
      isExecl: false,
      selectedRowKeys: [],
      scrollY: "",
    };
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
     this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getPlant();
    this.getListAll();
  },
  methods: {
    closeModal(){
      this.isExecl = false
    },
    getListAll() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getMitemrequirement(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getMitemrequirement(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
        }
      });
    },
    //关闭弹窗
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            week: values.week,
            pmc: values.pmc,
          };
          getMitemrequirement(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
            }
          });
          // do something
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加机构类型";
      this.visible = true;
    },
    //初始化表单
    defaultForm() {
      this.form = {
        PlantId: "",
        WorkShopId: "",
        LineCode: "",
        LineName: "",
        LineDesc: "",
        Enable: "Y",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    //编辑
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑机构类型";
      this.form = item;
    },
    //弹框确认按钮
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //编辑
          if (this.isEdit) {
            let editForm = {
              LineId: this.form.LineId,
              LineName: this.form.LineName,
              LineDesc: this.form.LineDesc,
              Enable: this.form.Enable,
            };
            mitemrequirementAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getListAll();
              }
            });
          } else {
            //添加
            mitemrequirementAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getListAll();
                this.defaultForm();
                this.visible = false;
              }
            });
          }
        }
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          mitemrequirementAction(self.selectedRowKeys, "delete").then((res) => {
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
      console.log(item);
      let parmas = [];
      parmas.push(item.Id);
      mitemrequirementAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    importExcel() {
      this.isExecl = true;
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getListAll();
    },
  },
};
</script>

<style></style>
