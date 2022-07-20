<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2022-07-12 10:26:32
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/backlog/index.vue
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
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">
          <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
          <a-button v-if="hasPerm('approve')" icon="check-circle" type="primary" :disabled="!hasSelected" :loading="loading" @click="allApprove" style="margin-left: 8px">批量审批</a-button>
          <a-button v-else icon="check-circle" type="primary" disabled :loading="loading" @click="allApprove" style="margin-left: 8px">批量审批</a-button>
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
          :scroll="{ y: scrollY, x: 4000 }"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :rowClassName="rowClassName"
          @change="handleTableChange"
          :rowKey="(dataSource) => dataSource.RegisterId"
          bordered
        >
          <!-- <a-table slot="expandedRowRender" size="small" :columns="innerColumns" :data-source="innerData" :pagination="false">
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
          </a-table> -->
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
              <a style="margin-right: 8px" @click="schedule(record.RegisterId)" :disabled="!hasPerm('look')">
                <a-icon type="container" />
                查看进度
              </a>
            </div>
          </template>
        </a-table>
      </a-card>
      <useForm v-if="isForm" :isClone="isClone" :isEditBnt="isEditBnt" :isEdit="isEdit" :editData="editData" :enterList="enterList" @closeModal="closeModal" @success="getListAll" />
      <schedule v-if="isSchedule" :registerid="registerid" @closeModal="closeModal" @success="getEnterList" />
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
import schedule from "./schedule.vue";
import { mapState } from "vuex";
export default {
  mixins: [PublicVar],
  components: { useForm, schedule },
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
      departmentalList: [],
      isSchedule: false,
      registerid: "",
      isClone: false,
      isEditBnt: false,
    };
  },
  updated() {
    renderStripe();
  },
  watch: {
    RegisterId: function(value) {
      if (value && value != "") {
        this.getEditInfo(value);
        this.isClone = true;
      }
    },
  },
  computed: {
    ...mapState({
      RegisterId: (start) => start.specimen.RegisterId,
    }),
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = this.getTableScroll(70);
    });
    console.log("params===", this.RegisterId);
    if (this.RegisterId && this.RegisterId != "") {
      this.getEditInfo(this.RegisterId);
      this.isClone = true;
    }
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
    schedule(id) {
      this.isSchedule = true;
      this.registerid = id;
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.getListAll();
    },
    edit(record) {
      this.isForm = true;
      this.isEdit = true;
      this.isEditBnt = true;
      console.log("record====", record);
      this.editData = record;
    },
    closeModal() {
      this.isForm = false;
      this.isImport = false;
      this.isSchedule = false;
    },
    getEditInfo(id) {
      let params = {
        registerid: id,
      };
      getMaterialSampleApi(params, "getregistersingle").then((res) => {
        if (res.data.success) {
          this.isEditBnt = false;
          this.isForm = true;
          this.isEdit = true;
          this.editData = res.data.data;
        }
      });
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
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterId,
        usercode: localStorage.getItem("account"),
      };
      getDepartmentApi(parmas, "getregisterpersonallist").then((res) => {
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
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            usercode: localStorage.getItem("account"),
          };
          getDepartmentApi(parmas, "getregisterpersonallist").then((res) => {
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
    allApprove() {
      let self = this;
      self.$confirm({
        title: "确定要审批选中内容",
        onOk() {
          let params = {
            RegisterList: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.RegisterList.push({
              RegisterId: item,
            });
          });
          setDepartmentApi(params, "batchsubmit").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("审批成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
     //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          let params = {
            RegisterList: [],
          };
          self.selectedRowKeys.forEach((item) => {
            params.RegisterList.push({
              RegisterId: item,
            });
          });
          setDepartmentApi(params, "deleteregisterpersonal").then((res) => {
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
      let parmas = {
        RegisterList: [
          {
            RegisterId: item.RegisterId, //部门ID
          },
        ],
      };
      setDepartmentApi(parmas, "deleteregisterpersonal").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    rowClassName(record) {
      return record.IsCurrentPointReturnStatus == "Y" ? "Rowactive" : "";
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
/deep/.Rowactive > td {
  // background-color: #ed0e0e !important;
  color: #f60e0e !important;
}
</style>
