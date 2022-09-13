<!--
 * @Author: max
 * @Date: 2022-04-29 09:07:46
 * @LastEditTime: 2022-09-13 16:14:08
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/mqtt/gateway/service.vue
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
                    <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
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
                <a-form-item label="服务器ip" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入服务器ip" v-decorator="['ip']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="服务编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入MQTT服务编码" v-decorator="['servercode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="服务名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入MQTT服务名称" v-decorator="['servername']" />
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
          <a-button v-if="hasPerm('switch')" icon="play-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="startService" style="margin-left: 8px">启动服务</a-button>
          <a-button v-else icon="play-circle" type="primary" disabled :loading="loading" style="margin-left: 8px">启动服务</a-button>
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
            getCheckboxProps: getCheckboxProps,
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
          <template slot="Ports" slot-scope="text">
            <div v-for="(item, index) in text" :key="index">{{ item.Protocol + "/" + item.Port }}</div>
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
      <serviceForm v-if="isForm" :isEdit="isEdit" :editData="editData" @closeModal="closeModal" @success="getListAll" />
    </a-spin>
  </div>
</template>

<script>
import { getMqttServiceAction, setMqttServiceAction } from "@/services/eap.js";
import {getSopDocument} from '@/services/esop.js'
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data/service";
import serviceForm from "./components/serviceForm.vue";
import ExportExcel from "@/utils/ExportExcelJS";
export default {
  mixins: [PublicVar],
  components: { serviceForm },
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
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.search();
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
      let params = {
        entertypecode: "PLANT",
      };
      getSopDocument(params, "getplant").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    plantChange(e) {
      this.plantId = e;
      let params = {
        plantid: e,
      };
      getSopDocument(params, "getworkcenter").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    workshopChange(e) {
      let params = {
        plantid: this.plantId,
        workshopid: e,
      };
      getSopDocument(params, "getline").then((res) => {
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
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getMqttServiceAction(params, "get").then((res) => {
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
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.State == "已启动",
      },
    }),
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            workshopid: values.workshopid,
            line: values.line,
            ip: values.ip,
            servercode: values.servercode,
            servername: values.servername,
          };
          getMqttServiceAction(params, "get").then((res) => {
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
          setMqttServiceAction(self.selectedRowKeys, "delete").then((res) => {
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
      let params = [];
      params.push(item.Id, null);
      setMqttServiceAction(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    startService() {
      let params = [];
      this.dataSource.forEach((item) => {
        if (this.selectedRowKeys.includes(item.Id)) {
          let ports = [];
          item.Ports.forEach((items) => {
            ports.push({
              protocol: items.Protocol,
              port: items.Port,
            });
          });
          params.push({
            path: item.Path,
            processname: item.ServerName,
            ports
          });
        }
      });
      params.push({});
      setMqttServiceAction(params, "start").then((res) => {
        if (res.data.success) {
          this.$message.success("启动成功!");
          this.getListAll();
        }
      });
    },
    switchBtn(record) {
      let params = [];
      let urlType = "";
      if (record.State == "未启动") {
        urlType = "start";
        let ports = [];
        record.Ports.forEach((item) => {
          ports.push({
            protocol: item.Protocol,
            port: item.Port,
          });
        });
        params.push(
          {
            path: record.Path,
            processname: record.ServerName,
            ports,
          },
          {}
        );
      } else {
        urlType = "stop";
        params.push(
          {
            processname: record.ServerName,
          },
          {}
        );
      }
      setMqttServiceAction(params, urlType).then((res) => {
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
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plantid: values.plantid,
        workshopid: values.workshopid,
        line: values.line,
      };
      getMqttServiceAction(params, "getall").then((res) => {
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
