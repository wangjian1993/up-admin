<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2021-09-08 16:18:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/config/authority/AuthoType.vue
-->
<template>
  <div>
    <a-modal v-model="visible" @cancel="close" @ok="handleOk" centered :width="800">
      <div>
        <div class="search-box">
          <a-row>
            <a-col :span="24">
              <a-form layout="horizontal" :form="searchForm" class="form-box">
                <div>需求公司:{{ enterArray.EnterName }}</div>
                <div style="margin-left:20px">
                  <a-form-item>
                    <a-input
                      placeholder="请输入部门编码名称"
                      allowClear
                      style="width:300px"
                      v-decorator="[
                        'searcValue',
                        {
                          rules: [{ required: true, message: '等级编码/名称' }],
                        },
                      ]"
                    />
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
            :scroll="{ y: true }"
            :pagination="pagination"
            @change="handleTableChange"
            :rowKey="(list) => list.Id"
            :customRow="rowClick"
            :rowClassName="rowClassName"
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
            <template slot="enable" slot-scope="record">
              <div>
                <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
                <a-tag color="red" v-else>禁用</a-tag>
              </div>
            </template>
            <template slot="IsPartAuth" slot-scope="record">
              <div>
                <a-tag color="green" v-if="record == 'Y'">是</a-tag>
                <a-tag color="red" v-else>否</a-tag>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns1 = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    width: "10%",
  },
  {
    title: "部门编码",
    dataIndex: "Code",
    scopedSlots: { customRender: "Code" },
    align: "center",
  },
  {
    title: "部门名称",
    dataIndex: "Name",
    scopedSlots: { customRender: "Name" },
    align: "center",
  },
  {
    title: "上级部门",
    dataIndex: "SuperName",
    scopedSlots: { customRender: "SuperName" },
    align: "center",
  },
];
const columns2 = [
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
import { getQuotePermission } from "@/services/web.js";
export default {
  props: ["enterArray", "typeArray"],
  data() {
    return {
      size: "small",
      visible: true,
      isAddModal: false,
      columns: [],
      columns1,
      columns2,
      list: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      rowSelectionType: "radio",
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
      onOrgId: 0,
    };
  },
  created() {
    this.getList();
    if (this.typeArray.ParamCode != "PERMISSION_TYPE_USER") {
      this.columns = this.columns1;
    } else {
      this.columns = this.columns2;
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    getList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterArray.EnterId,
      };
      let url = "";
      if (this.typeArray.ParamCode != "PERMISSION_TYPE_USER") {
        url = "getorgs";
      } else {
        url = "getusers";
      }
      getQuotePermission(parmas, url).then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
      });
    },
    //table行点击
    rowClick(record) {
      return {
        on: {
          dblclick: () => {
            console.log(record);
            this.onOrgId = record.OrgId;
            this.$emit("orgSubSelect", record);
          },
        },
      };
    },
    //table行class
    rowClassName(record) {
      let className = "";
      if (record.OrgId == this.onOrgId) {
        className = "rowActive";
        this.is_check = true;
      }
      return className;
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
        let array = [];
        for (let task of this.selectedRowKeys) {
          const itemJson = this.list.find((item) => {
            return item.Id === task;
          });
          array.push(itemJson);
        }
        this.$emit("okModal", array, 1);
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
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: this.enterArray.EnterId,
            keyword: values.searcValue,
          };
          let url = "";
          if (this.typeArray.ParamCode != "PERMISSION_TYPE_USER") {
            url = "getorgs";
          } else {
            url = "getusers";
          }
          getQuotePermission(parmas, url).then((res) => {
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
