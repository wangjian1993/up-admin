<!--
 * @Author: max
 * @Date: 2022-04-29 09:08:06
 * @LastEditTime: 2022-07-28 10:01:45
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/mqtt/gateway/client.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['workshopid']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                    <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['lineid']" style="width: 200px" placeholder="请选择生产车间">
                    <a-select-option v-for="item in LineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['equipmentid']" style="width: 200px" placeholder="请选择生产车间">
                    <a-select-option v-for="item in deviceList" :key="item.EquimentId" :value="item.EquimentId">{{ item.EquimentName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="MQTT服务" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['serverid']" style="width: 200px" placeholder="请选择生产车间">
                    <a-select-option v-for="item in serviceList" :key="item.Id" :value="item.Id">{{ item.ServerName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="客服端编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入MQTT客服端编码" v-decorator="['servercode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="客服端名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入MQTT客服端名称" v-decorator="['servername']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">
          <a-button type="primary" @click="add" icon="plus" :disabled="!hasPerm('add')">新增</a-button>
          <a-button :disabled="!hasPerm('export')" style="margin-left: 8px" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button v-if="hasPerm('switch')" icon="play-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="startClient" style="margin-left: 8px">启动客户端</a-button>
          <a-button v-else icon="play-circle" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">启动客户端</a-button>
          <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
          <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          size="small"
          :scroll="{ y: scrollY }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.Id"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="State" slot-scope="text">
            <div>
              <a-tag color="green" v-if="text == '已启动'">{{ text }}</a-tag>
              <a-tag color="red" v-else>{{ text }}</a-tag>
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
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
              <a style="margin-right: 8px" @click="switchBtn(record)" :disabled="!hasPerm('switch')">
                <a-icon :type="record.State == '未启动' ? 'pause-circle' : 'play-circle'" />
                {{ record.State == "未启动" ? "启动" : "关闭" }}
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <clientForm v-if="isForm" :isEdit="isEdit" :editData="editData" @closeModal="closeModal" @success="getListAll" :deviceList="deviceList" :serviceList="serviceList" />
    </a-spin>
  </div>
</template>

<script>
import { getMqttClientAction, getPlantList, setMqttClientAction, getWorkshopAction, getMqttServiceAction, getDeviceAction } from "@/services/eap.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data/client";
import clientForm from "./components/clientForm.vue";
import ExportExcel from "@/utils/ExportExcelJS";
export default {
  mixins: [PublicVar],
  components: { clientForm },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      plantList: [],
      isSearch: 0,
      isExportLod: false,
      editData: [],
      isEdit: false,
      isForm: false,
      selectedRowKeys: [],
      workshopList: [],
      plantId: "",
      LineList: [],
      isBind: false,
      serviceList: [],
      deviceList: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.search();
    this.getPlant();
    this.getServiceList();
    this.getDeviceList();
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.search();
    },
    getServiceList() {
      let parmas = {
        pageindex: 1,
        pagesize: 1000,
      };
      getMqttServiceAction(parmas, "get").then((res) => {
        if (res.data.success) {
          this.serviceList = res.data.data.list;
        }
      });
    },
    getDeviceList() {
      let parmas = {
        pageindex: 1,
        pagesize: 1000,
      };
      getDeviceAction(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.deviceList = res.data.data.list;
        }
      });
    },
    add() {
      this.isForm = true;
      this.isEdit = false;
      this.editData = [];
    },
    bind() {
      this.isBind = true;
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
    },
    closeModal() {
      console.log("关闭窗口");
      this.isBind = false;
      this.isForm = false;
      this.isEdit = false;
      this.editData = [];
    },
    getPlant() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getPlantList(parmas, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    plantChange(e) {
      this.plantId = e;
      let parmas = {
        plantid: e,
      };
      getWorkshopAction(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    workshopChange(e) {
      let parmas = {
        plantid: this.plantId,
        workshopid: e,
      };
      getPlantList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.LineList = res.data.data;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getMqttClientAction(parmas, "get").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.totalCount;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            workshopid: values.workshopid,
            line: values.line,
            serverid: values.serverid,
            equipmentid: values.equipmentid,
            clientcode: values.clientcode,
            clientname: values.clientname,
          };
          getMqttClientAction(parmas, "get").then((res) => {
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
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          self.selectedRowKeys.push(null);
          setMqttClientAction(self.selectedRowKeys, "delete").then((res) => {
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
      let parmas = [];
      parmas.push(item.Id, null);
      setMqttClientAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    startClient() {
      let parmas = [];
      this.dataSource.forEach((item) => {
        if (this.selectedRowKeys.includes(item.Id)) {
          parmas.push({
            url: item.Path,
            httpmethod: "Post",
            clientid: item.EquipmentCode,
            serverip: item.ServerIP,
            serverport: item.ServerPort,
          });
        }
      });
      parmas.push({});
      setMqttClientAction(parmas, "start").then((res) => {
        if (res.data.success) {
          this.$message.success("启动成功!");
          this.getListAll();
        }
      });
    },
    switchBtn(record) {
      let parmas = [];
      let urlType = "";
      if (record.State == "未启动") {
        urlType = "start";
        parmas.push(
          {
            url: record.Path,
            httpmethod: "Post",
            clientid: record.EquipmentCode,
            serverip: record.ServerIP,
            serverport: record.ServerPort,
          },
          {}
        );
      } else {
        urlType = "stop";
        parmas.push(
          {
            url: record.Path,
            httpmethod: "Post",
            clientid: record.EquipmentCode,
          },
          {}
        );
      }
      setMqttClientAction(parmas, urlType).then((res) => {
        if (res.data.success) {
          if (urlType == "start") {
            this.$message.success("启动成功!");
          } else {
            this.$message.success("关闭成功!");
          }
          this.getListAll();
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plantid: values.plantid,
        workshopid: values.workshopid,
        line: values.line,
      };
      getMqttClientAction(parmas, "getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(",");
              }
            });
            return item;
          });
          const header = [];
          columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `工站列表_${timestamp}.xlsx`);
            this.$message.success("导出数据成功!");
          } catch (error) {
            // console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
