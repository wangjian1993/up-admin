<!--
 * @Author: max
 * @Date: 2022-03-31 09:19:37
 * @LastEditTime: 2023-05-04 15:27:14
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/push/config/push.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="选择设备" @cancel="close" :footer="null" centered width="70%">
      <div>
        <a-form layout="horizontal" :form="searchForm">
          <a-row>
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
            <a-col :md="6" :sm="24">
              <a-form-item label="设备名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备名称" v-decorator="['equipmentname']" />
              </a-form-item>
            </a-col>
          </a-row>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search(false)">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">
          <a-button v-if="hasPerm('push')" icon="push" type="primary" :disabled="!hasSelected" :loading="loading" @click="pushDel" style="margin-left: 8px">推送</a-button>
          <a-button v-else icon="push" type="primary" disabled :loading="loading" @click="pushDel" style="margin-left: 8px">推送</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :size="size"
            :pagination="pagination"
            :scroll="{ y: 400 }"
            :rowKey="(dataSource) => dataSource.EquipmentId"
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
                <a-tag color="green" v-if="text">已连接</a-tag>
                <a-tag color="red" v-else>未连接</a-tag>
              </div>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a style="margin-right: 8px" @click="push(record)" :disabled="!record.Status">
                  <a-icon type="push" />
                  推送
                </a>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "车间",
    dataIndex: "WorkCenterName",
    scopedSlots: { customRender: "WorkCenterName" },
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
    title: "连接状态",
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
import { getKanBanDevice, setKanBanDevice } from "@/services/mes.js";
import { getSopDocument } from "@/services/esop.js";
export default {
  props: ["pushData"],
  data() {
    return {
      searchForm: this.$form.createForm(this),
      dataSource: [],
      columns,
      size: "small",
      visible: true,
      selectedRowKeys: [],
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
      lineList: [],
      workshopList: [],
      workshopId: "",
    };
  },
  created() {
    this.searchBtn();
    this.getWorkshopList();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    reset() {
      this.searchBtn();
      this.searchForm.resetFields();
    },
    workShopChange(e) {
      this.searchForm.setFieldsValue({
        lineid: "",
      });
      this.workshopId = e;
      this.getLineList();
    },
    getWorkshopList() {
      let params = {
        plantid: this.pushData.PlantId,
      };
      getSopDocument(params, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let params = {
        plantid: this.pushData.PlantId,
        workshopid: this.workshopId,
      };
      getSopDocument(params, "getline").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    closeModal() {
      this.isPreview = false;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    close() {
      this.$emit("closeModal");
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    pushDel() {
      let self = this;
      self.$confirm({
        title: "确定要推送选中内容",
        onOk() {
          let params = {
            ids: [self.pushData.Id],
            eids: [],
          };
          self.selectedRowKeys.forEach((key) => {
            params.eids.push(key);
          });
          setKanBanDevice(params, "publish").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("推送成功!");
            }
          });
        },
        onCancel() {},
      });
    },
    push(record) {
      let params = {
        ids: [this.pushData.Id],
        eids: [record.EquipmentId],
      };
      setKanBanDevice(params, "publish").then((res) => {
        if (res.data.success) {
          this.$message.success("推送成功!");
        }
      });
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: this.pushData.PlantId,
            kanbancode: values.kanbancode,
            kanbanname: values.kanbanname,
          };
          getKanBanDevice(params, "get").then((res) => {
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

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  min-height: 0vh;
}
</style>
