<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2021-10-14 10:41:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/buyer/BuyerUser.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="个人用户列表" @cancel="close" @ok="handleOk" centered :width="800">
      <div>
        <div class="search-box">
          <a-row>
            <a-col :span="24">
              <a-form layout="horizontal" :form="searchForm" class="form-box">
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
              type: 'radio',
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
import { getBuyerAction } from "@/services/web.js";
export default {
  props: ["enterArray", "typeArray"],
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
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    getList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getBuyerAction(parmas, "getusers").then((res) => {
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
        const itemJson = this.list.find((item) => {
            return item.Id === this.selectedRowKeys[0];
        });
        this.$emit("okModal", itemJson);
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
          this.pagination.current = 1;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.searcValue,
          };
          getBuyerAction(parmas, "getusers").then((res) => {
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
/deep/.ant-table {
  min-height: 0vh;
}
</style>
