<!--
 * @Author: max
 * @Date: 2022-03-28 10:24:01
 * @LastEditTime: 2022-09-13 13:54:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/complaint/list.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="客诉日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="客户名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入设备名称" v-decorator="['customername']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="业务员" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品大类" v-decorator="['businessuser']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品系列" v-decorator="['orderno']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品系列" v-decorator="['itemclass']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="产品类别" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品系列" v-decorator="['itemtype']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="出货日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="责任部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品系列" v-decorator="['department']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="出货日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="8D报告号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入产品系列" v-decorator="['reportno']" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a style="margin-right: 8px" @click="helpClick('http://192.168.1.245:8080/docs/#/esop/docs')"><a-icon type="question-circle" /> 帮助</a>
          <a-button type="primary" @click="searchBtn" :disabled="!hasPerm('search')">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
        </span>
      </a-form>
      <div class="operator">
        <a-button icon="plus" type="primary" :disabled="!hasPerm('add')" :loading="loading" @click="add" style="margin-left: 8px">添加</a-button>
        <a-button icon="import" type="primary" :disabled="!hasPerm('import')" :loading="loading" @click="isImport = true" style="margin-left: 8px">导入</a-button>
        <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
        <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
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
        <template slot="Status" slot-scope="text">
          <div>
            <a-tag color="green" v-if="text != '待审核'">{{ text }}</a-tag>
            <a-tag color="red" v-else>{{ text }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" @confirm="() => useDelete(record, 'delete')">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" :disabled="!hasPerm('edit')" @click="useEdit(record)">
              <a-icon type="edit" />
              编辑
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <ListForm v-if="isForm" :editData="editData" :isEdit="isEdit" @close="onClose" @success="searchBtn" />
      <ImportExcel v-if="isImport" @closeModal="onClose" @success="searchBtn" />
    </a-card>
  </div>
</template>

<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getComplaint, setComplaint } from "@/services/esop.js";
import ListForm from "./component/listForm.vue";
import { columns } from "./data/list";
import { PublicVar } from "@/mixins/publicVar.js";
import ImportExcel from "./component/ImportExcel.vue";
export default {
  components: { ListForm, ImportExcel },
  mixins: [PublicVar],
  data() {
    return {
      data: [],
      columns,
      loading: true,
      editData: [],
      isEdit: false,
      isForm: false,
      uploadData: [],
      isUser: false,
      isImport: false,
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.search();
  },
  methods: {
    onClose() {
      this.isForm = false;
      this.isImport = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.week = "";
      this.searchForm.resetFields();
      this.search();
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var uploadstarttime = rangeValue[0].format("YYYY-MM-DD");
            var uploadendtime = rangeValue[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue = values["range-time-picker1"];
            var salestarttime = rangeValue[0].format("YYYY-MM-DD");
            var saleendtime = rangeValue[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] && values["range-time-picker2"].length == 2) {
            const rangeValue = values["range-time-picker2"];
            var reportstarttime = rangeValue[0].format("YYYY-MM-DD");
            var reportendtime = rangeValue[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            customername: values.customername,
            businessuser: values.businessuser,
            orderno: values.orderno,
            itemcode: values.itemcode,
            itemtype: values.itemtype,
            department: values.department,
            reportno: values.reportno,
            salestarttime: salestarttime,
            saleendtime: saleendtime,
            uploadstarttime: uploadstarttime,
            uploadendtime: uploadendtime,
            reportstarttime: reportstarttime,
            reportendtime: reportendtime,
          };
          getComplaint(params, "get").then((res) => {
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
      getComplaint({ id: item.Id }, "single").then((res) => {
        if (res.data.success) {
          this.isForm = true;
          this.editData = res.data.data;
          this.isEdit = true;
        }
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setComplaint(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.search();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    useDelete(item) {
      let params = [item.Id];
      setComplaint(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.search();
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
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
