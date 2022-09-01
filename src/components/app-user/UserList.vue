<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2022-08-26 10:55:12
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/components/app-user/UserList.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="用户列表" @cancel="close" @ok="handleOk" centered :width="800">
      <div>
        <div class="search-box">
          <a-row>
            <a-col :span="24">
              <a-form layout="horizontal" :form="searchForm" class="form-box">
                <div>
                  <a-form-item label="公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-decorator="['enterpriseid']" style="width: 200px" placeholder="请选择公司">
                      <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div style="margin-left:20px">
                  <a-form-item>
                    <a-input placeholder="请输入用户编码/名称" allowClear style="width:300px" v-decorator="['searcValue']" />
                  </a-form-item>
                </div>
                <span style="margin-left:20px;margin-top:-5px">
                  <a-button type="primary" @click="search">查询</a-button>
                  <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                </span>
              </a-form>
            </a-col>
          </a-row>
        </div>
        <!-- 列表 -->
        <div class="tab">
          <a-table
            :columns="columns"
            :data-source="list"
            :size="size"
            :scroll="{ y: 500 }"
            :pagination="pagination"
            @change="handleTableChange"
            :rowKey="(list) => list.Id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              type: 'radio',
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    width: "10%",
  },
  {
    title: "用户账号",
    dataIndex: "Code",
    scopedSlots: { customRender: "Code" },
    align: "center",
  },
  {
    title: "用户名称",
    dataIndex: "Name",
    scopedSlots: { customRender: "Name" },
    align: "center",
  },
  {
    title: "用户类型",
    dataIndex: "SurperName",
    scopedSlots: { customRender: "SurperName" },
    align: "center",
  },
];
import { getQuotePermission, getDemandEnter } from "@/services/web.js";
export default {
  props: ["plantList", "typeArray"],
  data() {
    return {
      size: "small",
      visible: true,
      isAddModal: false,
      columns,
      list: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      enterList:[],
      enterpriseid:""
    };
  },
  created() {
    this.getDemandEnter();
  },
  methods: {
    getDemandEnter() {
      let params = {
        entertypecode: "COMPANY",
      };
      getDemandEnter(params).then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
          this.enterpriseid =this.enterList[0].EnterId
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterList[0].EnterId,
          });
          this.getList();
        }
      });
    },
    close() {
      this.$emit("closeModal");
    },
    getList() {
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterpriseid,
      };
      getQuotePermission(params, "getusers").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOk() {
      if (this.selectedRowKeys.length > 0) {
        let itemJson =[]
        for (let task of this.selectedRowKeys) {
          itemJson = this.list.find((item) => {
            return item.Id === task;
          });
        }
        console.log("array===", itemJson);
        this.$emit("okModal", itemJson, 1);
      } else {
        this.$emit("okModal");
      }
    },
    reset() {
      this.getList();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            keyword: values.searcValue,
          };
          getQuotePermission(params, "getusers").then((res) => {
            if (res.data.success) {
              this.list = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
          });
          // do something
        }
      });
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList();
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
