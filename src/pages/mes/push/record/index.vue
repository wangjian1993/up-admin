<!--
 * @Author: max
 * @Date: 2022-04-04 16:01:38
 * @LastEditTime: 2023-05-03 10:59:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/push/record/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备编号" v-decorator="['equipmentcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="设备名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备名称" v-decorator="['equipumentname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="MAC地址" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入MAC地址" v-decorator="['procode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="看板编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入看板编码" v-decorator="['proname']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="看板名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入看板名称" v-decorator="['documentcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="推送人" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入文件名称" v-decorator="['documentname']" />
              </a-form-item>
            </a-col>
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
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
        </span>
      </a-form>
      <div class="operator">
        <!-- <a-button v-if="hasPerm('publish')" icon="publish" type="primary" :disabled="!hasSelected" :loading="loading" @click="publishAll" style="margin-left: 8px">推送SOP</a-button>
        <a-button v-else icon="check-square" type="primary" disabled :loading="loading" style="margin-left: 8px">推送SOP</a-button> -->
        <!-- <a-button v-if="hasPerm('push')" icon="publish" type="primary" :disabled="!hasSelected" :loading="loading" @click="pushAll" style="margin-left: 8px">推送SOP</a-button> -->
        <!-- <a-button v-else icon="push" type="primary" disabled :loading="loading" style="margin-left: 8px">推送SOP</a-button> -->
        <!-- <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `共选中 ${selectedRowKeys.length} 条` }}
          </template>
        </span> -->
      </div>
      <a-table
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: scrollY }"
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
        <template slot="Enable" slot-scope="text">
          <div>
            <a-tag color="green" v-if="text == 'Y'">启用</a-tag>
            <a-tag color="red" v-else>禁用</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" @confirm="() => onDelete(record, 'delete')">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
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
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "工作中心",
    dataIndex: "WorkShopNmae",
    scopedSlots: { customRender: "WorkShopNmae" },
    align: "center",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "设备编码",
    dataIndex: "EquipmentCode",
    scopedSlots: { customRender: "EquipmentCode" },
    align: "center",
  },
  {
    title: "设备名称",
    dataIndex: "EquipmentName",
    scopedSlots: { customRender: "EquipmentName" },
    align: "center",
  },
  {
    title: "设备MAC",
    dataIndex: "MACAddress",
    scopedSlots: { customRender: "MACAddress" },
    align: "center",
  },
  {
    title: "看板编码",
    dataIndex: "ProType",
    scopedSlots: { customRender: "ProType" },
    align: "center",
  },
  {
    title: "看板名称",
    dataIndex: "KanbanName",
    scopedSlots: { customRender: "KanbanName" },
    align: "center",
  },
  {
    title: "推送人",
    dataIndex: "PublishUser",
    scopedSlots: { customRender: "PublishUser" },
    align: "center",
  },
  {
    title: "推送时间",
    dataIndex: "PublishTime",
    scopedSlots: { customRender: "PublishTime" },
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
import { getKanBanRecord, setKanBanRecord } from "@/services/mes.js";
import { getSopDocument } from "@/services/esop.js";
export default {
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
      isDevice: false,
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
    detail(item) {
      this.isDevice = true;
      this.documentItem = item;
      console.log(this.documentItem);
    },
    close() {
      this.isDevice = false;
    },
    //工厂选择
    plantChange(e) {
      this.plantid = e;
      this.getWorkshopList();
      this.searchForm.setFieldsValue({
        workshopid: "",
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
      let params = {
        entertypecode: "PLANT",
      };
      getSopDocument(params, "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let params = {
        plantid: this.plantid,
      };
      getSopDocument(params, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let params = {
        plantid: this.plantid,
        workshopid: this.workshopId,
      };
      getSopDocument(params, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getKanBanRecord(params, "get").then((res) => {
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
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.Enable == "N", // Column configuration not to be checked
      },
    }),
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
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            equipmentcode: values.equipmentcode,
            equipmentname: values.equipmentname,
            documentcode: values.documentcode,
            documentname: values.documentname,
            plantid: values.plantid,
            workcenterid: values.workcenterid,
            lineid: values.lineid,
            procode: values.procode,
            proname: values.proname,
            protype: values.protype,
            protypedetail: values.protypedetail,
            status: values.status,
          };
          getKanBanRecord(params, "get").then((res) => {
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
    //单个删除
    onDelete(item) {
      let params = [item.Id, null];
      setKanBanRecord(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
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
