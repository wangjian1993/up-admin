<!--
 * @Author: max
 * @Date: 2022-04-04 13:38:31
 * @LastEditTime: 2022-07-01 10:58:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/pushRecord/deviceList.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="选择SOP文档" @cancel="close" @ok="handleOk" centered width="80%">
      <div>
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
                <a-form-item label="ip地址" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入ip" v-decorator="['ipaddress']" />
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
                <a-form-item label="是否启用" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['enable']" style="width: 200px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="treu">启用</a-select-option>
                    <a-select-option value="false">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <span style="display: flex;justify-content: flex-end;">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </div>
        </a-form>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="deviceList"
            :size="size"
            :pagination="pagination"
            :scroll="{ y: 400 }"
            :rowKey="(deviceList) => deviceList.EquipmentId"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              type: 'radio',
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="FileSize" slot-scope="text">
              <p>{{ getFileSize(text) }}</p>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a style="margin-right: 8px" @click="preview(record)">
                  <a-icon type="profile" />
                  预览
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
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "设备编号",
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
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "工作中心",
    dataIndex: "WorkCenterName",
    scopedSlots: { customRender: "WorkCenterName" },
    align: "center",
    width: "5%",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "是否启用",
    dataIndex: "Enable",
    scopedSlots: { customRender: "Enable" },
    align: "center",
  },
  {
    title: "IP地址",
    dataIndex: "IPAddress",
    scopedSlots: { customRender: "IPAddress" },
    align: "center",
  },
  {
    title: "Mac地址",
    dataIndex: "MACAddress",
    scopedSlots: { customRender: "MACAddress" },
    align: "center",
  },
  {
    title: "连接状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
];
import { getSopDevice, getSopDocument } from "@/services/esop.js";
export default {
  props: ["documentItem", "deviceItem", "plantId"],
  data() {
    return {
      data: [],
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
      deviceList: [],
      isPreview: false,
      previewRecord: [],
      searchForm: this.$form.createForm(this),
      plantid: "", //工厂
      plantList: [],
      workshopList: [],
      workshopId: "", //车间
      lineList: [],
    };
  },
  created() {
    this.getSopDevice();
    this.getEnterList();
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    getSopDevice() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getSopDevice(parmas, "get").then((res) => {
        if (res.data.success) {
          this.deviceList = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
          this.pagination = pagination;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let record = this.deviceList.find((item) => item.EquipmentId == this.selectedRowKeys[0]);
      this.$emit("closeModal");
      this.$emit("deviceSuccess", record);
    },
    reset() {
      this.getdeviceList();
      this.searchForm.resetFields();
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
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getSopDevice();
    },
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
            workcenterid: values.workcenterid,
            lineid: values.lineid,
            ipaddress: values.ipaddress,
            enable: values.enable,
            status: values.status,
          };
          getSopDevice(parmas, "get").then((res) => {
            if (res.data.success) {
              this.deviceList = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
              this.pagination = pagination;
            }
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
