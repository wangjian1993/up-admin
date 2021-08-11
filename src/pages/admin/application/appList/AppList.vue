<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-08-10 14:07:34
 * @LastEditors: max
 * @Description: 应用列表
 * @FilePath: /up-admin/src/pages/admin/application/appList/AppList.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <!-- 搜索 -->
    <div class="search-box">
      <a-row>
        <a-col :span="12">
          <div>
            <a-button @click="add" type="primary" icon="form">添加</a-button>
            <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" icon="delete" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
          </div>
        </a-col>
        <a-col :span="12">
          <a-row type="flex" justify="end">
            <a-col :span="6">
              <a-form layout="horizontal" :form="searchForm">
                <div>
                  <a-form-item :wrapperCol="{ span: 24, offset: 1 }">
                    <a-input
                      placeholder="请输入应用编码/名称"
                      allowClear
                      v-decorator="[
                        'searcValue',
                        {
                          rules: [{ required: true, message: '请输入应用编码/名称!' }],
                        },
                      ]"
                    />
                  </a-form-item>
                </div>
              </a-form>
            </a-col>
            <a-col :span="6">
              <span style="float: left; margin-top: 3px;">
                <a-button type="primary" icon="search" style="margin:0 10px" @click="search">搜索</a-button>
                <a-button @click="reset" icon="reload">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div><add-app v-if="visible" @cloneModal="cloneModal" :isEdit="isEdit" :editForm="editForm" @succeed="getAppInfoList"></add-app></div>
    <!-- 表格列表 -->
    <div class="tab">
      <a-table
        :columns="columns"
        :data-source="data"
        size="small"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(tableDatas) => data.EnterTypeId"
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
        <template slot="AppLogo" slot-scope="text, record">
          <div><a-icon :type="record.AppLogo" /></div>
        </template>
        <template slot="enable" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
            <a-tag color="red" v-else>禁用</a-tag>
          </div>
        </template>
        <template slot="defualt" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">是</a-tag>
            <a-tag color="red" v-else>否</a-tag>
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
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="应用详情" :column="1">
          <a-descriptions-item label="应用图标"><a-icon :type="drawerItem.AppLogo"/></a-descriptions-item>
          <a-descriptions-item label="应用编码">{{ drawerItem.AppCode }}</a-descriptions-item>
          <a-descriptions-item label="应用名称">{{ drawerItem.AppName }}</a-descriptions-item>
          <a-descriptions-item label="应用类型">{{ drawerItem.AppTypeName }}</a-descriptions-item>
          <a-descriptions-item label="应用序号">{{ drawerItem.AppSortNo }}</a-descriptions-item>
          <a-descriptions-item label="布局">{{ drawerItem.LayoutTypeCode }}</a-descriptions-item>
          <a-descriptions-item label="配置类型">{{ drawerItem.ConfigTypeCode }}</a-descriptions-item>
          <a-descriptions-item label="组件路径">{{ drawerItem.MouduleUrl }}</a-descriptions-item>
          <a-descriptions-item label="组件参数">{{ drawerItem.MouduleParam }}</a-descriptions-item>
          <a-descriptions-item label="访问方式">{{ drawerItem.AccessTypeCode }}</a-descriptions-item>
          <a-descriptions-item label="共享">
            <div>
              <a-tag color="green" v-if="drawerItem.IsShare == 'Y'">是</a-tag>
              <a-tag color="red" v-else>否</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="是否授权">
            <div>
              <a-tag color="green" v-if="drawerItem.IsAuth == 'Y'">是</a-tag>
              <a-tag color="red" v-else>否</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="是否启用">
            <div>
              <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="描述">{{ drawerItem.AppDesc }}</a-descriptions-item>
          <a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
          <a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
  </a-card>
</template>
<script>
//表头
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
  },
  {
    title: "应用名称",
    dataIndex: "AppName",
    scopedSlots: { customRender: "AppName" },
    align: "center",
  },
  {
    title: "编码",
    dataIndex: "AppCode",
    scopedSlots: { customRender: "AppCode" },
    align: "center",
  },
  {
    title: "应用类型",
    dataIndex: "AppTypeName",
    scopedSlots: { customRender: "AppTypeName" },
    align: "center",
  },
  {
    title: "图标",
    dataIndex: "AppLogo",
    scopedSlots: { customRender: "AppLogo" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "enable" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getAppInfoList, appInfoAction } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import AddApp from "../components/add-app.vue";
export default {
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加应用",
      loading: true,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      searcValue: "",
      searchForm: this.$form.createForm(this),
    };
  },
  //设置斑马纹
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getAppInfoList();
  },
  methods: {
    //状态选择
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    //查看详情
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //关闭弹出框
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getAppInfoList();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.searcValue,
          };
          getAppInfoList(parmas).then((res) => {
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
    getAppInfoList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getAppInfoList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
        }
      });
    },
    //关闭图案出框
    cloneModal() {
      this.visible = false;
    },
    //添加打开对话框
    add() {
      // this.defaultForm();
      this.isEdit = false;
      this.title = "添加应用";
      this.visible = true;
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    //编辑
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑应用";
      this.editForm = item;
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          const params = [];
          self.selectedRowKeys.forEach((item) => {
            params.push(self.data[item].AppId);
          });
          appInfoAction(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getAppInfoList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.AppId);
      appInfoAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getAppInfoList();
        }
      });
    },
    //页码切换
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getAppInfoList();
    },
  },
  components: { AddApp },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>
