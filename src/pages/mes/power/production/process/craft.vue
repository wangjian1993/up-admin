<!--
 * @Author: max
 * @Date: 2021-11-30 14:31:04
 * @LastEditTime: 2022-10-14 11:18:39
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/craft.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="编码/名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入工序编码/名称" v-decorator="['process']" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
        </span>
      </a-form>
    </div>
    <div class="operator">
      <a-button icon="plus" type="primary" :disabled="!hasPerm('add')" :loading="loading" @click="add" style="margin-left: 8px">新建</a-button>
      <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `共选中 ${selectedRowKeys.length} 条` }}
        </template>
      </span>
    </div>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: true }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(data) => data.RoutingId"
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
        <template slot="Enable" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
            <a-tag color="red" v-else>禁用</a-tag>
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
      <a-empty v-else description="暂无权限" />
      <craftForm v-if="isForm" :isEdit="isEdit" :editData="editData" :plantList="plantList" @closeModal="closeModal" @success="searchBtn" />
    </div>
  </a-card>
</template>
<script>
import { getCraft, setCraft } from "@/services/mes.js";
import { columns } from "./data/craft";
import { PublicVar } from "@/mixins/publicVar.js";
import craftForm from "./components/craftForm.vue";
export default {
  mixins: [PublicVar],
  components: { craftForm },
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      isForm: false,
      editData: [],
      plantList: [],
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.searchBtn();
    this.getPlant();
  },
  methods: {
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getCraft(params1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    closeModal() {
      this.isForm = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.searchBtn();
      this.searchForm.resetFields();
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
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            process: values.process,
          };
          getCraft(params, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
            }
          });
          // do something
        }
      });
    },
    //打开对话框
    add() {
      this.isEdit = false;
      this.isForm = true;
    },
    //编辑
    edit(item) {
      let params = {
        id: item.RoutingId,
      };
      getCraft(params, "getsingle").then((res) => {
        if (res.data.success) {
          this.isForm = true;
          this.isEdit = true;
          this.editData = res.data.data;
        }
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setCraft(self.selectedRowKeys, "delete").then((res) => {
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
    onDelete(item) {
      let params = [];
      params.push(item.RoutingId);
      setCraft(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.searchBtn();
        }
      });
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.searchBtn();
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-table {
  min-height: 65vh;
  max-height: 65vh;
  overflow: auto;
}
</style>
