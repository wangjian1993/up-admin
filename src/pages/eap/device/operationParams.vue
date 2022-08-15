<!--
 * @Author: max
 * @Date: 2022-05-05 11:01:59
 * @LastEditTime: 2022-07-28 09:44:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/device/operationParams.vue
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
                  <a-select v-decorator="['lineid']" style="width: 200px" placeholder="请选择生产车间" @change="lineChange">
                    <a-select-option v-for="item in LineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['equimentid']" style="width: 200px" placeholder="请选择设备">
                    <a-select-option v-for="item in deviceList" :key="item.EquimentId" :value="item.EquimentId">{{ item.EquimentName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="参数类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['paramtype']" style="width: 200px" placeholder="请选择参数类型">
                    <a-select-option v-for="item in paramsItem.PLC_PARAMS_TYPE" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="数据类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['datatype']" style="width: 200px" placeholder="请选择数据类型">
                    <a-select-option v-for="item in paramsItem.PLC_PARAMS_DATA_TYPE" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="参数名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入参数名称" v-decorator="['paramname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="参数编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入参数编码" v-decorator="['paramcode']" />
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
          <a-button type="primary" @click="add" :disabled="!hasPerm('add')" icon="plus">新增</a-button>
          <a-button style="margin-left: 8px" type="primary" @click="batchAdd" :disabled="!hasPerm('add')" icon="plus">批量新增/编辑</a-button>
          <a-button style="margin-left: 8px" :disabled="!hasPerm('export') && dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button style="margin-left: 8px" :disabled="!hasPerm('import')" type="primary" @click="importExcel" icon="import">导入</a-button>
          <a-button style="margin-left: 8px" :disabled="!hasPerm('import')" type="primary" @click="downExcel" icon="import">导入模板下载</a-button>
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
          :scroll="{ y: scrollY, x: 2400 }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.VarValueId"
          bordered
        >
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="VarIsMust" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record == 'Y'">必填</a-tag>
              <a-tag color="red" v-else>非必填</a-tag>
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
            </div>
          </template>
        </a-table>
      </a-card>
      <operationForm v-if="isForm" :isEdit="isEdit" :editData="editData" :paramsItem="paramsItem" @closeModal="closeModal" @success="getListAll" />
      <batchAdd v-if="isBatchAdd" :paramsItem="paramsItem" @closeModal="closeModal" @success="getListAll" />
      <ImportPlcParamsExcel v-if="isImport" @closeModal="closeModal" @success="getListAll" />
    </a-spin>
  </div>
</template>

<script>
import { getOperationAction, setOperationAction ,getPlantList ,getWorkshopAction ,getDeviceAction} from "@/services/eap.js";
import { getParamData } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data/operation";
import operationForm from "./components/operationForm.vue";
import batchAdd from "./components/batchAdd.vue";
import ExportExcel from "@/utils/ExportExcelJS";
import ImportPlcParamsExcel from "./components/ImportPlcParamsExcel.vue";
export default {
  mixins: [PublicVar],
  components: { operationForm, ImportPlcParamsExcel, batchAdd },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      plcTypeList: [],
      isSearch: 0,
      isExportLod: false,
      editData: [],
      isEdit: false,
      isForm: false,
      selectedRowKeys: [],
      plcBrand: [],
      isImport: false,
      paramsList: ["PLC_PARAMS_TYPE", "PLC_PARAMS_DATA_TYPE", "PLC_PARAMS_ADDRESS_BIT", "PLC_IS_MUST", "PLC_AUTH_RW", "PLC_UUPER_COMPUTER_AUTH","DATA_UNIT"],
      paramsItem: [],
      isBatchAdd: false,
      plantList:[],
      workshopList:[],
      LineList:[],
      deviceList:[],
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
    this.getParamsData();
    this.getPlant();
  },
  methods: {
    splitData,
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
          this.searchForm.setFieldsValue({
            workshopid: "",
            lineid: "",
            equimentid:""
          });
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
          this.searchForm.setFieldsValue({
            lineid: "",
            equimentid:""
          });
        }
      });
    },
    lineChange(e){
      let parmas = {
        lineid: e,
      };
      getDeviceAction(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.deviceList = res.data.data;
          this.searchForm.setFieldsValue({
            equimentid:""
          });
        }
      });
    },
    //重置搜索
    getParamsData() {
      this.paramsList.forEach((item) => {
        let parmas = {
          groupcode: item,
        };
        getParamData(parmas).then((res) => {
          if (res.data.success) {
            this.paramsItem[item] = res.data.data;
          }
          console.log(this.paramsItem.PLC_PARAMS_TYPE);
        });
      });
    },
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.search();
    },
    batchAdd() {
      this.isBatchAdd =true
    },
    add() {
      this.isForm = true;
      this.isEdit = false;
      this.editData = [];
    },
    //导入
    importExcel() {
      this.isImport = true;
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
    },
    closeModal() {
      this.isForm = false;
      this.isImport = false;
      this.isBatchAdd = false;
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
      getOperationAction(parmas, "getall").then((res) => {
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
            paramtype: values.paramtype,
            paramcode: values.paramcode,
            paramname: values.paramname,
            datatype: values.datatype,
            plantid: values.plantid,
            workshopid: values.workshopid,
            lineid:values.lineid,
            equimentid: values.equimentid,
          };
          getOperationAction(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
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
          setOperationAction(self.selectedRowKeys, "delete").then((res) => {
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
      parmas.push(item.VarValueId);
      setOperationAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    downExcel(){},
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        paramtype: values.paramtype,
        paramcode: values.paramcode,
        paramname: values.paramname,
        datatype: values.datatype,
        plantid: values.plantid,
        workshopid: values.workshopid,
        lineid:values.lineid,
        equimentid: values.equimentid,
      };
      getOperationAction(parmas, "getall").then((res) => {
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
            ExportExcel(header, dataSource, `参数列表_${timestamp}.xlsx`);
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
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
