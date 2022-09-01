<!--
 * @Author: max
 * @Date: 2022-05-05 11:01:59
 * @LastEditTime: 2022-08-19 17:44:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/templateDesign/list.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="模板名称/编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入模板名称/编码" v-decorator="['keyword']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="模板类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['companyid']" placeholder="请选择公司" style="width: 200px">
                  <a-select-option v-for="item in templateType" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="机构类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['orgid']" placeholder="请选择机构类型" style="width: 200px" @change="orgChange">
                  <a-select-option :value="item.EnterTypeCode" v-for="item in orgList" :key="item.EnterTypeId">{{ item.EnterTypeName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="机构名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['companyid']" placeholder="请选择机构名称" style="width: 200px">
                  <a-select-option :value="item.EnterId" v-for="item in companyList" :key="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </div>
      </a-form>
      <div class="operator">
        <a-button type="primary" @click="add" icon="plus" :disabled="!hasPerm('add')">新增</a-button>
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
        :rowKey="(dataSource) => dataSource.Id"
        bordered
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="StatusName" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == '正常'">{{ record }}</a-tag>
            <a-tag color="red" v-else>{{ record }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
              <a-icon type="bell" />
              编辑
            </a>
            <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
          </div>
        </template>
      </a-table></a-card
    >
    <printModal v-if="isShowPrint" @succeed="search" @closeModal="closeModal" :orgList="orgList" :templateType="templateType" :isEdit="isEdit" :editData="editData"/>
  </div>
</template>
<script>
import { getInstitutionList, getEnterTypeList, getTemplateAction, getParamData, setTemplateAction } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data/list";
import printModal from "./printModal.vue";
export default {
  mixins: [PublicVar],
  components: { printModal },
  data() {
    return {
      scrollY: "",
      advanced: false,
      columns,
      dataSource: [],
      isSearch: 0,
      isShowPrint: false,
      selectedRowKeys: [],
      orgList: [],
      companyList: [],
      templateType: [],
      isEdit: false,
      editData: [],
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
    this.getParamData();
    this.getInstitutionList();
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.listType = "全部";
      this.search();
      this.getInstitutionList();
    },
    closeModal() {
      this.isShowPrint = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.search();
    },
    getParamData() {
      let params = {
        groupcode: "TEMPLATE_TYPE",
      };
      getParamData(params).then((res) => {
        if (res.data.success) {
          this.templateType = res.data.data;
        }
      });
    },
    //获取机构类型列表
    getInstitutionList() {
      let params = {
        pageindex: this.pagination.current,
        pagesize: 100,
      };
      getInstitutionList(params).then((res) => {
        if (res.data.success) {
          this.orgList = res.data.data.list;
        }
      });
    },
    orgChange(e) {
      let params = {
        entertypecode: e,
      };
      getEnterTypeList(params).then((res) => {
        if (res.data.success) {
          this.companyList = res.data.data;
        }
      });
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    add() {
       this.isEdit = false
      this.isShowPrint = true;
      this.editData = [];
    },
    edit(item) {
      let params = {
        id: item.Id,
      };
      getTemplateAction(params, "single").then((res) => {
        if (res.data.success) {
          this.editData = res.data.data;
          this.isEdit = true;
          this.isShowPrint = true;
        }
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setTemplateAction(self.selectedRowKeys, "delete").then((res) => {
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
    onDelete(item) {
      let params = [];
      params.push(item.Id);
      setTemplateAction(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.search();
        }
      });
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.keyword,
            orgid: values.orgid,
            companyid: values.companyid,
            type: values.type,
          };
          getTemplateAction(params, "get").then((res) => {
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
  },
};
</script>

<style lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
