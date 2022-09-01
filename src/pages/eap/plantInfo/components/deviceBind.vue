<!--
 * @Author: max
 * @Date: 2022-05-05 15:19:26
 * @LastEditTime: 2022-05-09 15:21:00
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/plantInfo/components/deviceBind.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="绑定设备" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :bodyStyle="{ padding: '5px 5px', background: '#ececec' }">
      <a-row justify="space-between" :gutter="5">
        <a-col :span="18">
          <a-card :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" :rowKey="(dataSource) => dataSource.WorkStationId" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="Enable" slot-scope="record">
                <div>
                  <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
                  <a-tag color="red" v-else>禁用</a-tag>
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <div>
                  <a style="margin-right: 8px" @click="getDeviceList(record)">
                    设备列表
                  </a>
                </div>
              </template>
            </a-table>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-button type="primary" :disabled="deviceInfo == ''" style="margin:5px" @click="addDevice" icon="plus">添加设备</a-button>
            <a-table :columns="columns1" :data-source="deviceList" size="small" :pagination="false" :rowKey="(dataSource) => dataSource.WorkStationId" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <div>
                  <a style="margin-right: 8px" @click="unbind(record)">
                    解绑
                  </a>
                </div>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
      <deviceList v-if="isDeviceList" :deviceInfo="deviceInfo" @closeModal="closeModal" @success="success" />
    </a-drawer>
  </div>
</template>

<script>
import { getWorkstationAction, setWorkshopAction, setWorkstationAction } from "@/services/eap.js";
import deviceList from "./deviceList.vue";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "车间",
    dataIndex: "WorkShopName",
    scopedSlots: { customRender: "WorkShopName" },
    align: "center",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "工站",
    dataIndex: "WorkStationName",
    scopedSlots: { customRender: "WorkStationName" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
const columns1 = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
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
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  components: { deviceList },
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      columns1,
      dataSource: [],
      scrollY: "",
      loading: false,
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
      isDeviceList: false,
      deviceInfo: [],
    };
  },
  created() {
    this.getListAll();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isDeviceList = false;
    },
    success(){
       this.getDeviceList(this.deviceInfo);
    },
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getWorkstationAction(params, "getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    getDeviceList(record) {
      this.deviceInfo = record;
      let params = [record.WorkStationId];
      setWorkstationAction(params, "selects").then((res) => {
        if (res.data.success) {
          this.deviceList = res.data.data[0].EquipmentList;
        }
      });
    },
    //添加设备
    addDevice() {
      this.isDeviceList = true;
    },
    unbind(record) {
      let params = {
        WorkStationId: this.deviceInfo.WorkStationId,
        EquipmentList: [
          {
            EquipmentId: record.EquipmentId,
          },
        ],
      };
      setWorkstationAction(params, "unbind").then((res) => {
        if (res.data.success) {
          this.getDeviceList(this.deviceInfo);
          this.$message.success("解绑成功");
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              PlantId: this.form.PlantId,
              WorkShopId: this.editData.WorkShopId,
              WorkShopCode: this.form.WorkShopCode,
              WorkShopName: this.form.WorkShopName,
              WorkShopDesc: this.form.WorkShopDesc,
              Enable: this.form.Enable,
            };
            setWorkshopAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setWorkshopAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          }
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
/deep/ .ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-table {
  min-height: 74.5vh;
}
</style>
