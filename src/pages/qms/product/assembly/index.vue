<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-06-02 14:07:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/product/assembly/index.vue
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
                  <a-select v-decorator="['plant']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['workshop']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                    <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['line']" style="width: 200px" placeholder="请选择生产产线">
                    <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入订单号" v-decorator="['orderno']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="工单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入工单号" v-decorator="['mocode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['procode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="工序" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['process']" style="width: 200px" placeholder="请选择工序">
                    <a-select-option v-for="item in procedureData" :key="item.Id" :value="item.Id">{{ item.ProcessName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="检验结果" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['inspectresult']" style="width: 300px" placeholder="请选择检验结果">
                    <a-select-option v-for="item in paramsItem" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="检验员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['users']" style="width: 300px" mode="multiple" placeholder="请选择检验员">
                    <a-select-option v-for="item in userList" :key="item.UserId" :value="item.UserId">{{ item.UserName }}</a-select-option>
                  </a-select>
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
          <a-button type="primary" @click="add" icon="plus">新增</a-button>
          <a-button style="margin-left: 8px" :disabled="!hasPerm('export') && dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <!-- <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
          <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span> -->
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          size="small"
          :scroll="{ y: scrollY, x: 2600 }"
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
          <template slot="InspectResultName" slot-scope="test">
            <div>
              <a-tag color="green" v-if="test === '合格'">合格</a-tag>
              <a-tag color="red" v-else>不合格</a-tag>
            </div>
          </template>
          <template slot="StatusName" slot-scope="test">
            <div>
              <a-tag color="#87d068" v-if="test === '合格'">合格</a-tag>
              <a-tag color="#f50" v-else-if="test === '不合格'">不合格</a-tag>
              <a-tag color="#108ee9" v-else>未审核</a-tag>
            </div>
          </template>
          <template slot="DateTimeInspect" slot-scope="test, record">
            <div>
              <span>{{ splitDataTime(record.DateTimeInspect) }}</span>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a-popconfirm title="确定删除?" @confirm="() => onDelete(record.Id)">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                编辑
              </a>
              <a style="margin-right: 8px" v-if="record.Status === 'UNAUDITED'" @click="check(record)" :disabled="!hasPerm('approve')">
                <a-icon type="check-circle" />
                审核
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <useForm v-if="isForm" :isEdit="isEdit" :editData="editData" :enterList="plantList" @closeModal="closeModal" @success="searchBtn" />
      <Check v-if="isCheck" :editData="editData" :paramsItem="paramsItem" @closeModal="closeModal" @success="searchBtn" />
    </a-spin>
  </div>
</template>

<script>
import { getProductAssembly, setProductAssembly } from "@/services/qms.js";
import { getDailyReport, getProcessLine } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitDataTime, splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import useForm from "./form.vue";
import ExportExcel from "@/utils/ExportExcelJS";
import { getParamData } from "@/services/admin.js";
import Check from "./check.vue";
export default {
  mixins: [PublicVar],
  components: { useForm, Check },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      innerColumns,
      dataSource: [],
      deviceTypeList: [],
      isSearch: 0,
      isExportLod: false,
      editData: [],
      isEdit: false,
      isForm: false,
      isCheck: false,
      selectedRowKeys: [],
      plantList: [],
      workshopList: [],
      procedureData: [],
      lineList: [],
      workshopId: "",
      plantid: "",
      paramsItem: [],
      userList: [],
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
    this.getUserList();
    this.getPlant();
    this.getParamsData();
    this.getProcessList();
  },
  methods: {
    splitDataTime,
    splitData,
    getParamsData() {
      let params1 = {
        groupcode: "IQC_INCOMING_TEST_ITEM_RESULT",
      };
      getParamData(params1).then((res) => {
        if (res.data.success) {
          this.paramsItem = res.data.data;
        }
      });
    },
    plantChange(e) {
      if (e == "") return;
      this.plantId = e;
      this.searchForm.setFieldsValue({
        workshopid: "",
        lineid: "",
      });
      this.getWorkshopList();
    },
    //车间选择
    workshopChange(e) {
      if (e == "") return;
      this.workshopId = e;
      this.searchForm.setFieldsValue({
        lineid: "",
      });
      this.getLineList();
    },
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getDailyReport(params1, "getplantlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
        }
      });
    },
    //获取车间
    getWorkshopList() {
      let params = {
        plantid: this.plantId,
      };
      getDailyReport(params, "getworkshoplist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    //获取产线
    getLineList() {
      let params = {
        workshop: this.workshopId,
      };
      getDailyReport(params, "getlinelist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    getProcessList() {
      let params = {
        pageindex: 1,
        pagesize: 100,
      };
      getProcessLine(params, "getall").then((res) => {
        if (res.data.success) {
          this.procedureData = res.data.data.list;
          console.log("this.procedureData", this.procedureData);
        }
      });
    },
    getUserList() {
      getProductAssembly("", "gettestusers").then((res) => {
        if (res.data.success) {
          this.userList = res.data.data;
        }
      });
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.searchBtn();
    },
    add() {
      this.isForm = true;
      this.isEdit = false;
      this.editData = [];
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
    },
    check(record) {
      this.isCheck = true;
      this.editData = record;
    },
    closeModal() {
      this.isForm = false;
      this.isCheck = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var begindate = rangeValue[0].format("YYYY-MM-DD");
            var enddate = rangeValue[1].format("YYYY-MM-DD");
          }
          console.log("values.users===", values.users);
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plant: values.plant,
            workshop: values.workshop,
            line: values.line,
            orderno: values.orderno,
            mocode: values.mocode,
            procode: values.procode,
            bgdate: begindate,
            enddate: enddate,
            process: values.process,
            inspectresult: values.inspectresult,
            users: values.users ? values.users.join(",") : "",
          };
          getProductAssembly(params, "getall").then((res) => {
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
          setProductAssembly(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.searchBtn();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(id) {
      setProductAssembly({ Id: id }, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.searchBtn();
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
        const rangeValue = values["range-time-picker"];
        var begindate = rangeValue[0].format("YYYY-MM-DD");
        var enddate = rangeValue[1].format("YYYY-MM-DD");
      }
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plant: values.plant,
        workshop: values.workshop,
        line: values.line,
        orderno: values.orderno,
        mocode: values.mocode,
        procode: values.procode,
        bgdate: begindate,
        enddate: enddate,
        process: values.process,
        inspectresult: values.inspectresult,
      };
      getProductAssembly(params, "getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item, index) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              item.index = index + 1;
            });
            let dateString = JSON.parse(JSON.stringify(item.DateTimeInspect));
            // let date = dateString
            // let time = dateString
            item.InspectDate = item.DateTimeInspect !== "" ? splitData(dateString) : "";
            item.DateTimeInspect = item.DateTimeInspect !== "" ? splitDataTime(dateString) : "";
            return item;
          });
          const header = [];
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `组装成品首件_${timestamp}.xlsx`);
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
/deep/.ant-table:nth-of-type(0) {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
