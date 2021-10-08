<!--
 * @Author: max
 * @Date: 2021-09-07 18:11:08
 * @LastEditTime: 2021-10-08 15:09:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/buyer/BuyerCategory.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="modelTypes == 1 ? '产品大类' : '物料编码'" @cancel="close" @ok="handleOk" centered :width="800">
      <div>
        <div class="search-box">
          <a-row>
            <a-col :span="24">
              <a-form layout="horizontal" :form="searchForm" class="form-box">
                <div style="margin-left:20px">
                  <a-form-item>
                    <a-input placeholder="请输入大类编码/名称" allowClear style="width:200px" v-decorator="['keyword']" />
                  </a-form-item>
                </div>
                <div style="margin-left:20px">
                  <a-form-item v-if="modelTypes == 2">
                    <a-input placeholder="请输入物料编码/名称" allowClear style="width:200px" v-decorator="['code']" />
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
            :rowKey="(list) => (modelTypes == 1 ? list.MitemCategoryId : list.MitemCode)"
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
    title: "大类编码",
    dataIndex: "MitemCategoryCode",
    scopedSlots: { customRender: "MitemCategoryCode" },
    align: "center",
  },
  {
    title: "大类名称",
    dataIndex: "MitemCategoryName",
    scopedSlots: { customRender: "MitemCategoryName" },
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
    title: "物料编码",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "物料名称",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: "物料大类",
    dataIndex: "CategoryCode1",
    scopedSlots: { customRender: "CategoryCode1" },
    align: "center",
  },
];
import { getBuyerAction } from "@/services/web.js";
export default {
  props: ["modelTypes"],
  data() {
    return {
      size: "small",
      visible: true,
      isAddModal: false,
      columns: [],
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
    this.columns = this.modelTypes == 1 ? columns1 : columns2;
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
      let url = this.modelTypes == 1 ? "getcategorys" : "getmitems";
      getBuyerAction(parmas, url).then((res) => {
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
        let array = [];
        for (let task of this.selectedRowKeys) {
          const itemJson = this.list.find((item) => {
            if (this.modelTypes == 1) {
              return item.MitemCategoryId === task;
            } else {
              return item.MitemCode === task;
            }
          });
          array.push(itemJson);
        }
        this.$emit("okModal", array, this.modelTypes);
      } else {
        this.$emit("okModal");
      }
    },
    reset() {
      this.pagination.current = 1;
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
          let parmas = [];
          if (this.modelTypes == 1) {
            parmas = {
              pageindex: this.pagination.current,
              pagesize: this.pagination.pageSize,
              keyword: values.keyword,
            };
          } else {
            parmas = {
              pageindex: this.pagination.current,
              pagesize: this.pagination.pageSize,
              category: values.keyword,
              keyword: values.code,
            };
          }

          let url = this.modelTypes == 1 ? "getcategorys" : "getmitems";
          getBuyerAction(parmas, url).then((res) => {
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
