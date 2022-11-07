<template>
  <div>
    <a-modal v-model="visible" title="供应商列表" @cancel="close" @ok="handleOk" centered width="60%">
      <a-row>
        <a-col :span="18">
          <div class="search-box">
            <a-form layout="horizontal" :form="searchForm">
              <a-row>
                <a-col :md="8" :sm="24">
                  <a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input placeholder="请输入供应商名称" allowClear style="width:200px" v-decorator="['keyword']" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <span>
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
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
                onSelect: onSelect,
                onSelectAll: onSelectAll,
                type: 'radio'
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
        </a-col>
        <a-col :span="6">
          <div>
            <a-tag style="margin:4px 4px" v-for="item in selectedRows" :key="item.Id" closable @close="() => handleClose(item.Id)">
              {{ item.Name }}
            </a-tag>
          </div>
        </a-col>
      </a-row>
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
    title: "供应商编码",
    dataIndex: "Code",
    scopedSlots: { customRender: "Code" },
    align: "center",
  },
  {
    title: "供应商名称",
    dataIndex: "Name",
    scopedSlots: { customRender: "Name" },
    align: "center",
  },
];
import { getEnterOrgTree } from "@/services/admin.js";
export default {
  props: ["defaultEnterType" ,"defaultEnterTypeId"],
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
      enterList: [],
      enterpriseid: "",
      tagList: [],
      selectedRows: [],
    };
  },
  created() {
    this.search();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    handleClose(id) {
      this.selectedRowKeys = this.selectedRowKeys.filter((item) => item != id);
      this.selectedRows = this.selectedRows.filter((item) => item.Id != id);
      console.log(this.selectedRows);
    },
    //多选
    onSelectChange(selectedRowKeys) {
      //   console.log("selectedRows==", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      //   console.log("this.selectedRowKeys==", this.selectedRowKeys);
      //   this.tagList = selectedRows;
    },
    onSelect(record, selected) {
      if (selected) {
        this.selectedRows.push(record);
      }

      if (!selected) {
        const delIndex = this.selectedRows.findIndex((val) => {
          return val.Id === record.Id;
        });
        this.selectedRows.splice(delIndex, 1);
      }
      //   console.log(this.selectedRows)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected) {
        this.selectedRows = this.selectedRows.concat(changeRows);
      }
      if (!selected) {
        let selectedRows = JSON.parse(JSON.stringify(this.selectedRows));
        const delIndex = [];
        selectedRows.forEach((item, index) => {
          changeRows.forEach((val) => {
            if (item.Id === val.Id) {
              delIndex.push(index);
            }
          });
        });
        delIndex.forEach((item) => {
          delete selectedRows[item];
        });
        selectedRows = selectedRows.filter((item) => {
          return item !== undefined;
        });
        this.selectedRows = selectedRows;
      }
      //   console.log(this.selectedRows)
    },
    handleOk() {
      this.$emit("closeModal");
      this.$emit("success", this.selectedRows);
    },
    reset() {
      this.search();
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
            type: this.defaultEnterType,
            typeid: this.defaultEnterTypeId,
            keyword: values.keyword
          };
          getEnterOrgTree(params).then((res) => {
            if (res.data.success) {
              this.list = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
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
      this.search();
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
