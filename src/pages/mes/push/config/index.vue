<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-05-03 11:39:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/push/config/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="公司名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantid']" placeholder="请选择生产工厂">
                    <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="看板编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入看板编码" v-decorator="['kanbancode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="看板名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入看板名称" v-decorator="['kanbanname']" />
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6" :sm="24">
                      <a-form-item label="设备状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                        <a-select v-decorator="['status']" placeholder="请选择订单状态" style="width: 200px">
                          <a-select-option value="">全部</a-select-option>
                          <a-select-option value="1">启用</a-select-option>
                          <a-select-option value="0">禁用</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col> -->
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">
          <a-button type="primary" @click="add" icon="plus">新增</a-button>
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
              <a style="margin-right: 8px" @click="push(record)" :disabled="!hasPerm('push')">
                <a-icon type="export" />
                推送
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <useForm v-if="isForm" :isEdit="isEdit" :editData="editData" :enterList="enterList" @closeModal="closeModal" @success="searchBtn" />
      <pushForm v-if="isPush" :pushData="pushData" @closeModal="closeModal" @success="searchBtn"></pushForm>
    </a-spin>
  </div>
</template>

<script>
import { getKanBanConfig, setKanBanConfig, getPowerPlant } from "@/services/mes.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import useForm from "./form.vue";
import pushForm from './push.vue'
export default {
  mixins: [PublicVar],
  components: { useForm,pushForm },
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
      isPush:false,
      pushData:[]
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getEnterList();
    this.searchBtn();
  },
  methods: {
    splitData,
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
    push(record){
      this.isPush = true;
      this.pushData = record;
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
    },
    closeModal() {
      this.isForm = false;
      this.isPush = false;
    },
    getEnterList() {
      let params = {
        entertypecode: "PLANT",
      };
      getPowerPlant(params, "line/getlistbytypecode").then((res) => {
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
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            kanbancode: values.kanbancode,
            kanbanname: values.kanbanname,
          };
          getKanBanConfig(params, "get").then((res) => {
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
          self.selectedRowKeys.push(null)
          setKanBanConfig(self.selectedRowKeys, "delete").then((res) => {
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
      let params = [id,null]
      setKanBanConfig(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.searchBtn();
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
