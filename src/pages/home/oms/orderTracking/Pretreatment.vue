<!--
 * @Author: max
 * @Date: 2021-12-09 11:25:14
 * @LastEditTime: 2021-12-10 09:12:10
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/oms/orderTracking/Pretreatment.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-form layout="horizontal" :form="searchForm">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="销售公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['companyid']" style="width: 200px" placeholder="请选择销售公司">
                <a-select-option v-for="item in companyList" :key="item.EnterId" :value="item.EnterCode">{{ item.EnterName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="预处理用户" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入预处理用户" allowClear style="width: 150px" v-decorator="['user']" />
              <a-button @click="userSearch" style="margin-left: 8px" shape="circle" icon="search" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="预处理时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
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
      <a-button v-if="hasPerm('add')" icon="plus" type="primary" @click="add" style="margin-left: 8px">添加</a-button>
      <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `共选中 ${selectedRowKeys.length} 条` }}
        </template>
      </span>
    </div>
    <div>
      <a-modal :title="isEdit ? '编辑机构类型' : '添加预处理信息'" :visible="visible" v-if="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="CompanyId" has-feedback label="销售公司" prop="CompanyId">
            <a-select v-model="form.CompanyId" placeholder="请选择销售公司">
              <a-select-option v-for="item in companyList" :key="item.EnterId" :value="item.EnterCode">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: scrollY }"
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
        <template slot="Status" slot-scope="text,record">
          <div>
            <a-tag :color="text === 'PROCESS_FINISHED' || text === 'BOMPROCESSED' || text === 'PROCESSED'?'green':'red'">{{record.StatusName}}</a-tag>
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
            <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看订单跟踪
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </div>
    <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
  </a-card>
</template>
<script>
//表头
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "销售公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
    width: 130,
  },
  {
    title: "预处理用户",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "DateCreated",
    scopedSlots: { customRender: "DateCreated" },
    align: "center",
    width: 150,
  },
  {
    title: "预处理开始时间",
    dataIndex: "DateProcess",
    scopedSlots: { customRender: "DateProcess" },
    align: "center",
    width: 140,
  },
  {
    title: "预处理批次号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
    width: 130,
  },
  {
    title: "预处理订单数据耗时",
    dataIndex: "MasterTimeProcess",
    scopedSlots: { customRender: "MasterTimeProcess" },
    align: "center",
    width: 140,
  },
  {
    title: "订单记录数",
    dataIndex: "OrderCount",
    scopedSlots: { customRender: "OrderCount" },
    align: "center",
    width: 100,
  },
  {
    title: "处理状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
    width: 80,
  },
  {
    title: "预处理异常信息",
    dataIndex: "Msg",
    scopedSlots: { customRender: "Msg" },
    align: "center",
    width: 150,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: 180,
  },
];
import { getPreporcessApi, setPreporcessApi } from "@/services/web.js";
import getTableScroll from "@/utils/setTableHeight";
import { PublicVar } from "@/mixins/publicVar.js";
import UserList from "@/components/app-user/UserList";
export default {
  props: ["companyList", "plantList"],
  components: { UserList },
  mixins: [PublicVar],
  data() {
    return {
      data: [], //表格数据
      columns, //表头
      isEdit: false, //判断是否编辑
      editForm: [],
      selectedRowKeys: [],
      visible: false,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      searcValue: "",
      //初始化
      form: {
        CompanyId: "",
      },
      //表单验证
      rules: {
        EnterTypeCode: [
          {
            required: true,
            message: "请选择销售公司",
            trigger: "blur",
          },
        ],
      },
      isUserList: false,
    };
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getListAll();
  },
  methods: {
    //pmc选择
    userSearch() {
      this.isUserList = true;
    },
    closeUserModal() {
      this.isUserList = false;
    },
    okUserModal(item) {
      this.isUserList = false;
      this.searchForm.setFieldsValue({
        user: item.Name,
      });
    },
    //关闭模态窗
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
    detail(item) {
      // this.$router.push({ path: "/purchase/add", query: { id:item.Id} });
      this.$emit("toDetail", item.BatchNo);
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var startdate = rangeValue[0].format("YYYY-MM-DD");
            var enddate = rangeValue[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            companyid: values.companyid,
            user:values.user,
            startdate:startdate,
            enddate:enddate
          };
          getPreporcessApi(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
          });
          // do something
        }
      });
    },
    //获取机构类型列表
    getListAll() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getPreporcessApi(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.visible = true;
    },
    //初始化表单数据
    defaultForm() {
      this.form = {
        CompanyId: "",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    //提交确定按钮
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          setPreporcessApi(this.form, "add").then((res) => {
            if (res.data.success) {
              this.$message.success("添加成功!");
              this.getListAll();
              this.defaultForm();
              this.visible = false;
            }
          });
        }
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setPreporcessApi(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getListAll();
            } else {
              self.$message.warning(res.data.message.content);
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.Id);
      setPreporcessApi(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    //分页切换
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getListAll();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.form-box {
  display: flex;
  justify-content: flex-end;
}
</style>
