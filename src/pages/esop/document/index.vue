<!--
 * @Author: max
 * @Date: 2022-03-28 10:24:01
 * @LastEditTime: 2022-06-17 10:29:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/document/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="6" :sm="24">
              <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['workcenterid']" style="width: 200px" placeholder="请选择生产车间" @change="workShopChange">
                  <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['lineid']" style="width: 200px" placeholder="请选择生产产线">
                  <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="6" :sm="24">
              <a-form-item label="文档编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备编号" v-decorator="['documentcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="文档名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备名称" v-decorator="['documentname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品大类" v-decorator="['documentname']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品系列" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品系列" v-decorator="['documentname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['status']" style="width: 200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="已发布">已发布</a-select-option>
                  <a-select-option value="待审核">待审核</a-select-option>
                  <a-select-option value="已审核">已审核</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="上传日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a style="margin-right: 8px" @click="helpClick('http://192.168.1.245:8080/docs/#/esop/docs')"><a-icon type="question-circle" /> 帮助</a>
          <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
        </span>
      </a-form>
      <div class="operator">
        <a-button icon="plus" type="primary" :disabled="!hasPerm('add')" @click="add" style="margin-left: 8px">上传</a-button>
        <!-- <a-button v-if="hasPerm('approve')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">审核</a-button>
        <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">审核</a-button>
        <a-button v-if="hasPerm('retract')" icon="redo" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">撤回</a-button>
        <a-button v-else icon="redo" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">撤回</a-button>
        <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
        <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button> -->
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `共选中 ${selectedRowKeys.length} 条` }}
          </template>
        </span>
      </div>
      <a-table
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: scrollY }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(data) => data.DocumentId"
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
        <template slot="Status" slot-scope="text">
          <div>
            <a-tag color="green" v-if="text != '待审核'">{{ text }}</a-tag>
            <a-tag color="red" v-else>{{ text }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" v-if="record.Status == '待审核'" @confirm="() => useDelete(record, 'delete')">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a-popconfirm title="确定审核?" v-if="record.Status == '待审核'" @confirm="() => useDelete(record, 'audit')">
              <a style="margin-right: 8px" :disabled="!hasPerm('approve')">
                <a-icon type="check-circle" />
                审核
              </a>
            </a-popconfirm>
            <a-popconfirm title="确定撤回?" v-if="record.Status != '已发布'" @confirm="() => useDelete(record, 'retract')">
              <a style="margin-right: 8px" :disabled="!hasPerm('retract')">
                <a-icon type="redo" />
                撤回
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" :disabled="!hasPerm('edit')" @click="useEdit(record)">
              <a-icon type="edit" />
              编辑
            </a>
            <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看明细
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <Form v-if="isForm" :editData="editData" :isEdit="isEdit" @close="close" @success="success" />
      <useDetails v-if="isDrawer" :drawerItem="drawerItem" @closeModal="close" />
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "文件编号",
    dataIndex: "DocumentCode",
    scopedSlots: { customRender: "DocumentCode" },
    align: "center",
  },
  {
    title: "文件名称",
    dataIndex: "DocumentName",
    scopedSlots: { customRender: "DocumentName" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "产品大类",
    dataIndex: "ProType",
    scopedSlots: { customRender: "ProType" },
    align: "center",
  },
  {
    title: "产品系列",
    dataIndex: "ProTypeDetail",
    scopedSlots: { customRender: "ProTypeDetail" },
    align: "center",
  },
  {
    title: "附件数量",
    dataIndex: "FileCount",
    scopedSlots: { customRender: "FileCount" },
    align: "center",
  },
  {
    title: "版本号",
    dataIndex: "Version",
    scopedSlots: { customRender: "Version" },
    align: "center",
  },
  {
    title: "上传人",
    dataIndex: "Uploader",
    scopedSlots: { customRender: "Uploader" },
    align: "center",
  },
  {
    title: "上传时间",
    dataIndex: "UploadTime",
    scopedSlots: { customRender: "UploadTime" },
    align: "center",
  },
  {
    title: "审核人员",
    dataIndex: "Aduiter",
    scopedSlots: { customRender: "Aduiter" },
    align: "center",
  },
  {
    title: "审核时间",
    dataIndex: "AduitTime",
    scopedSlots: { customRender: "AduitTime" },
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
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getSopDocument, setSopDocumnet } from "@/services/esop.js";
import Form from "./form.vue";
import useDetails from "./details.vue";
export default {
  components: { Form, useDetails },
  data() {
    return {
      data: [],
      columns,
      isDrawer: false,
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
      isExecl: false,
      selectedRowKeys: [],
      scrollY: "",
      searchForm: this.$form.createForm(this),
      week: "",
      isSearch: false,
      isUserList: false,
      plantid: "", //工厂
      plantList: [],
      workshopList: [],
      workshopId: "", //车间
      lineList: [],
      isForm: false, //添加编辑
      drawerItem: [],
      editData: [],
      isEdit: false,
    };
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    filterData() {
      return this.columns.filter((obj) => {
        if (obj.dataIndex !== "Status") {
          return obj.dataIndex;
        }
      });
    },
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getListAll();
    this.getEnterList();
  },
  methods: {
    helpClick(url) {
      window.open(url, "_blank");
    },
    onClose() {
      this.isDrawer = false;
    },
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //工厂选择
    plantChange(e) {
      this.plantid = e;
      this.getWorkshopList();
      this.searchForm.setFieldsValue({
        workshop: "",
        line: "",
      });
    },
    //车间选择
    workShopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.searchForm.setFieldsValue({
        line: "",
      });
    },
    //获取生产工厂
    getEnterList() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getSopDocument(parmas, "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let parmas = {
        plantid: this.plantid,
      };
      getSopDocument(parmas, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantid,
        workshopid: this.workshopId,
      };
      getSopDocument(parmas, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getSopDocument(parmas, "get").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.week = "";
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var starttime = rangeValue[0].format("YYYY-MM-DD");
            var endtime = rangeValue[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            equipmentcode: values.equipmentcode,
            equipmentname: values.equipmentname,
            plantid: values.plantid,
            documentname: values.documentname,
            documentcode: values.documentcode,
            status: values.status,
            starttime: starttime,
            endtime: endtime,
          };
          getSopDocument(parmas, "get").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    //添加
    add() {
      this.isForm = true;
    },
    useEdit(item) {
      this.isForm = true;
      this.editData = item;
      this.isEdit = true;
    },
    close() {
      this.isForm = false;
      this.isDrawer = false;
      this.isEdit = false;
    },
    success() {
      this.isForm = false;
      this.getListAll();
    },
    //多选删除
    allDel() {
      let self = this;
      self.selectedRowKeys.push(null);
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setSopDocumnet(self.selectedRowKeys, "delete").then((res) => {
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
    useDelete(item, action) {
      let parmas = [item.DocumentId, null];
      setSopDocumnet(parmas, action).then((res) => {
        if (res.data.success) {
          if (action == "delete") {
            this.$message.success("删除成功!");
          }
          if (action == "audit") {
            this.$message.success("审核成功!");
          }
          if (action == "retract") {
            this.$message.success("撤回成功!");
          }
          this.getListAll();
        }
      });
    },
    //分压
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getListAll();
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 67vh;
}
/deep/.ant-table-body {
  min-height: 0vh;
}
</style>
