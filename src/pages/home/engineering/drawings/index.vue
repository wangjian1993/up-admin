<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-05-12 10:28:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/engineering/drawings/index.vue
-->
<template>
  <div>
    <a-spin :tip="tipText" :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="公司名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['enterid']" placeholder="请选择公司名称">
                    <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="物料号/名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入物料号/名称" v-decorator="['mitem']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="物料图号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入物料图号" v-decorator="['drawing']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="创建人" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入创建人" v-decorator="['createduser']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="创建日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
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
          <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button style="margin-left:10px" :disabled="!hasPerm('export')" type="primary" @click="synchronous" icon="cloud-sync">手动同步</a-button>
          <!-- <a-button type="primary" @click="add" icon="plus">新增</a-button> -->
          <!-- <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span> -->
        </div>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="Enable" slot-scope="record">
            <div>
              <a-tag color="green" v-if="record">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </template>
          <template slot="Users" slot-scope="record">
            <div>
              <a-tag v-for="item in record" :key="item.Id">
                {{ item.UserName }}
              </a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <!-- <a-popconfirm title="确定删除?" @confirm="() => onDelete(record.Id)">
                  <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                    <a-icon type="delete" />
                    删除
                  </a>
                </a-popconfirm> -->
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                <a-icon type="edit" />
                更新
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <useForm v-if="isForm" :isEdit="isEdit" :editData="editData" :enterList="enterList" @closeModal="closeModal" @success="searchBtn" />
    </a-spin>
  </div>
</template>

<script>
import { getEngineering ,setEngineering } from "@/services/erp.js";
import { getMaterialSampleApi } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import useForm from "./form.vue";
import ExportExcel from "@/utils/ExportExcelJS";
export default {
  mixins: [PublicVar],
  components: { useForm },
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
      selectedRowKeys: [],
      enterList: [],
      enterId: "",
      tipText:""
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.searchBtn();
    this.getEnterList();
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.searchBtn();
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
    },
    closeModal() {
      this.isForm = false;
      this.isImport = false;
    },
    getEnterList() {
      let params = {
        entertypecode: "COMPANY",
      };
      getMaterialSampleApi(params, "getenterlist").then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
        }
      });
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
            var starttime = rangeValue[0].format("YYYY-MM-DD");
            var endtime = rangeValue[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterid: values.enterid,
            mitem: values.mitem,
            drawing: values.drawing,
            startdate: starttime,
            enddate: endtime,
            createduser:values.createduser
          };
          getEngineering(params, "getall").then((res) => {
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
    synchronous() {
      this.isExportLod = true;
      this.tipText ="同步中...."
      setEngineering(["01"], "syncdata").then((res) => {
        if (res.data.success) {
          this.$message.success("同步成功!");
          this.searchBtn();
          this.isExportLod = false;
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      this.tipText ="导出中...."
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
        const rangeValue = values["range-time-picker"];
        var starttime = rangeValue[0].format("YYYY-MM-DD");
        var endtime = rangeValue[1].format("YYYY-MM-DD");
      }
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        enterid: values.enterid,
        mitem: values.mitem,
        drawing: values.drawing,
        startdate: starttime,
        enddate: endtime,
        createduser:values.createduser
      };
      getEngineering(params, "getall").then((res) => {
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
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `工程物料图纸管理_${timestamp}.xlsx`);
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
