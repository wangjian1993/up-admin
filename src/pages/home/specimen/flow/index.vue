<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2022-05-18 10:39:40
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/flow/index.vue
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
                  <a-select v-decorator="['enterpriseid']" placeholder="请选择公司名称">
                    <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
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
            <a-button type="primary" @click="search">查询</a-button>
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
          :expandedRowKeys="expandedRowKeys"
          @expandedRowsChange="expandedRowsChange"
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.FlowId"
          bordered
        >
          <a-table slot="expandedRowRender" slot-scope="record" size="small" :columns="innerColumns" :data-source="record.PointList" :pagination="false">
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ index + 1 }}</span>
              </div>
            </template>
            <template slot="ReceiverList" slot-scope="record">
              <div>
                <a-tag v-for="item in record" :key="item.ReceiverId">
                  {{ item.ReceiverName }}
                </a-tag>
              </div>
            </template>
          </a-table>
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
      </a-card>
      <useForm v-if="isForm" :isEdit="isEdit" :editData="editData" :enterList="enterList" @closeModal="closeModal" @success="getListAll" />
    </a-spin>
  </div>
</template>

<script>
import { getDepartmentApi, setDepartmentApi, getMaterialSampleApi } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
// import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns, innerColumns } from "./data";
import useForm from "./form.vue";
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
      innerData: [],
      expandedRowKeys: [],
      defaultExpandedRowKeys: [],
      defFlowId: "",
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = this.getTableScroll(70);
    });
    this.getEnterList();
  },
  methods: {
    splitData,
    getTableScroll(extraHeight = 70, id) {
      if (typeof extraHeight == "undefined") {
        //  默认底部分页64 + 边距10
        extraHeight = 70;
      }
      let tHeader = null;
      if (id) {
        tHeader = document.getElementById(id) ? document.getElementById(id).getElementsByClassName("ant-table-thead")[0] : null;
      } else {
        tHeader = document.getElementsByClassName("ant-table-thead")[0];
      }
      //表格内容距离顶部的距离
      // console.log("tHeader", tHeader);
      let tHeaderBottom = 0;
      let tHeaderTop = 0;
      if (tHeader) {
        tHeaderBottom = tHeader.getBoundingClientRect().bottom;
        tHeaderTop = tHeader.getBoundingClientRect().top;
      }
      // let height = document.body.clientHeight - tHeaderBottom - extraHeight
      let height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`;
      let height1 = `calc(100vh - ${tHeaderTop + extraHeight}px)`;
      // document.getElementsByClassName("ant-table")[0].style.maxHeight = `calc(100vh - ${tHeaderBottom}px)`;
      // document.getElementsByClassName("ant-table")[0].style.mixHeight = `calc(100vh - ${tHeaderBottom}px)`;
      const table = document.getElementsByClassName("ant-table")[0];
      table.style.minHeight = height1;
      // console.log(table);
      console.log("height", height);
      return height;
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.getListAll();
    },
    add() {
      this.isForm = true;
      this.isEdit = false;
      this.editData = [];
    },
    expandedRowsChange(expandedRows) {
      // this.expandedRowKeys = [];
      this.expandedRowKeys = expandedRows;
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.editData = record;
      this.expandedRowKeys = [];
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
          this.enterId = this.enterList[0].EnterId;
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterId,
          });
          this.getListAll();
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
        enterpriseid: this.enterId,
      };
      getDepartmentApi(params, "getflowlist").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          // this.dataSource.forEach((item) => {
          //   item.children = item.PointList;
          // });
          // console.log(this.innerData);
          // if (this.defFlowId != "") {
          //   let defItem = this.dataSource.find((item) => (item.FlowId = this.defFlowId));
          //   console.log(defItem);
          //   this.innerData = defItem.PointList;
          // }
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
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
          };
          getDepartmentApi(params, "getflowlist").then((res) => {
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
          let params = {
            FlowList: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.FlowList.push({
              FlowId: item,
            });
          });
          setDepartmentApi(params, "deleteflow").then((res) => {
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
      let params = {
        FlowList: [
          {
            FlowId: item.FlowId, //部门ID
          },
        ],
      };
      setDepartmentApi(params, "deleteflow").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
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
