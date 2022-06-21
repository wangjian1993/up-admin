<!--
 * @Author: max
 * @Date: 2022-03-30 13:41:09
 * @LastEditTime: 2022-06-16 11:36:38
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/deviceBind/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                  <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
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
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备编号" v-decorator="['equipmentcode']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备名称" v-decorator="['equipmentname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="文档编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入文档编码" v-decorator="['documentcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="文档名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入文档名称" v-decorator="['documentname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['procode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['proname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['status']" style="width: 200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="true">已发布</a-select-option>
                  <a-select-option value="false">未发布</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
        </span>
      </a-form>
      <div class="operator">
        <a-button icon="plus" type="primary" :loading="loading" @click="bind()" style="margin-left: 8px">新增</a-button>
        <a-button v-if="hasPerm('approve')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="useAllApprove" style="margin-left: 8px">发布</a-button>
        <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="useAllApprove" style="margin-left: 8px">发布</a-button>
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
        :rowKey="(data) => data.ID"
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
            <a-tag color="green" v-if="text == '已审核' || text == '已发布'">{{ text }}</a-tag>
            <a-tag color="red" v-else>{{ text }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" @click="edit(record)">
              <a-icon type="edit" />
              修改
            </a>
            <a-popconfirm title="确定发布?" @confirm="() => useApprove(record, 'delete')">
              <a style="margin-right: 8px" :disabled="!hasPerm('approve')">
                <a-icon type="delete" />
                发布
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <device v-if="isAddDevice" :editData="editData" :isDetail="isDetail" :isEdit="isEdit" @close="close" />
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
    title: "生产车间",
    dataIndex: "WorkCenterName",
    scopedSlots: { customRender: "WorkCenterName" },
    align: "center",
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
    width: "5%",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "生产产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
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
    title: "版本号",
    dataIndex: "Version",
    scopedSlots: { customRender: "Version" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "操作时间",
    dataIndex: "AduitTime",
    scopedSlots: { customRender: "AduitTime" },
    align: "center",
  },
  {
    title: "操作人",
    dataIndex: "Aduiter",
    scopedSlots: { customRender: "Aduiter" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "",
    scopedSlots: { customRender: "EquipentCode" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "",
    scopedSlots: { customRender: "EquipmentName" },
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
import { getSopDocument, deviceSopBind } from "@/services/esop.js";
import device from "./device.vue";
export default {
  components: { device },
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
      isAddDevice: false,
      documentItem: [],
      editData: [],
      isEdit: false,
      isDetail: false,
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
    bind() {
      this.editData = [];
      this.isEdit = false;
      this.isAddDevice = true;
      this.isDetail = false;
    },
    edit(record) {
      this.editData = [];
      this.isAddDevice = true;
      this.editData = record;
      this.isDetail = false;
      this.isEdit = true;
    },
    detail(record) {
      this.editData = [];
      this.isEdit = false;
      this.isAddDevice = true;
      this.editData = record;
      this.isDetail = true;
    },
    //工厂选择
    plantChange(e) {
      this.plantid = e;
      this.getWorkshopList();
      this.searchForm.setFieldsValue({
        workcenterid: "",
        lineid: "",
      });
    },
    //车间选择
    workShopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.searchForm.setFieldsValue({
        lineid: "",
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
      getSopDocument(parmas, "equipment/get").then((res) => {
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
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            equipmentcode: values.equipmentcode,
            equipmentname: values.equipmentname,
            plantid: values.plantid,
            lineid: values.lineid,
            workcenterid: values.workcenterid,
            proname: values.proname,
            procode: values.procode,
            documentcode: values.documentcode,
            documentname: values.documentname,
            status: values.status,
          };
          getSopDocument(parmas, "equipment/get").then((res) => {
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
    close() {
      this.isAddDevice = false;
    },
    //多选删除
    useAllApprove() {
      let self = this;
      self.selectedRowKeys.push(null);
      let parmas = [];
      this.data.forEach((item) => {
        console.log("self.selectedRowKeys---", self.selectedRowKeys);
        if (self.selectedRowKeys.includes(item.ID)) {
          parmas.push({
            documentid: item.DocumentId,
            lineid: item.LineId,
          });
        }
      });
      parmas.push({});
      self.$confirm({
        title: "确定要发布选中内容",
        onOk() {
          deviceSopBind(parmas, "publish").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("发布成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    useApprove(item) {
      let parmas = [
        {
          documentid: item.DocumentId,
          lineid: item.LineId,
        },
        {},
      ];
      deviceSopBind(parmas, "publish").then((res) => {
        if (res.data.success) {
          this.$message.success("发布成功!");
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
.ant-form-item {
  margin-bottom: 5px;
}
</style>
