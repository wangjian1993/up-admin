<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2021-09-23 19:11:00
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/masterPlan/MitemOrder.vue
-->
<template>
  <div>
    <a-modal v-model="visible" @cancel="close" @ok="handleOk" centered width="70%">
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <div class="search-box">
            <a-row>
              <a-col :span="24">
                <a-form layout="horizontal" :form="searchForm" class="form-box">
                  <div style="margin-left:20px">
                    <a-form-item>
                      <a-select style="width: 200px" v-decorator="['plantid']" placeholder="请选择生产工厂">
                        <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                  <div style="margin-left:20px">
                    <a-form-item>
                      <a-input placeholder="请输入供应商编码/名称" allowClear style="width:200px" v-decorator="['supplier']" />
                    </a-form-item>
                  </div>
                  <div style="margin-left:20px">
                    <a-form-item>
                      <a-input placeholder="请输入采购订单号" allowClear style="width:200px" v-decorator="['purchaseno']" />
                    </a-form-item>
                  </div>
                  <div style="margin-left:20px">
                    <a-form-item>
                      <a-input placeholder="请输入工号/姓名" allowClear style="width:200px" v-decorator="['batchno']" />
                    </a-form-item>
                  </div>
                  <div style="margin-left:20px">
                    <a-form-item>
                      <a-input disabled placeholder="请输入物料编码/名称" allowClear style="width:200px" v-decorator="['mitemcode']" />
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
              :rowKey="(list) => list.MitemCode"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                type: 'radio',
              }"
              bordered
            >
            </a-table>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    width: "5%",
    align: "center",
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
    title: "供应商编码",
    dataIndex: "SupplierCode",
    scopedSlots: { customRender: "SupplierCode" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantErpName",
    scopedSlots: { customRender: "PlantErpName" },
    align: "center",
  },
  {
    title: "采购订单号",
    dataIndex: "PurchaseOrderNo",
    scopedSlots: { customRender: "PurchaseOrderNo" },
    align: "center",
  },
  {
    title: "行项目",
    dataIndex: "LineItem",
    scopedSlots: { customRender: "LineItem" },
    align: "center",
  },
  {
    title: "行项目号",
    dataIndex: "lineItemNum",
    scopedSlots: { customRender: "lineItemNum" },
    align: "center",
  },
  {
    title: "采购工单",
    dataIndex: "",
    scopedSlots: { customRender: "" },
    align: "center",
  },
  {
    title: "采购名称",
    dataIndex: "EmployeeName",
    scopedSlots: { customRender: "EmployeeName" },
    align: "center",
  },
];
import { getScmAction } from "@/services/web.js";
export default {
  props: ["plantList","MitemCode"],
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
      loading: false,
      isSearch:false
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
      this.loading = true;
      console.log(this.MitemCode);
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        mitemcode:this.MitemCode
      };
      getScmAction(parmas, "manualmatch/getpurchaseorders").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch =false
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys,selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(selectedRows);
    },
    handleOk() {
      if (this.selectedRowKeys.length > 0) {
        let itemJson = {};
        for (let task of this.selectedRowKeys) {
          itemJson = this.list.find((item) => {
            return item.MitemCode === task;
          });
        }
        this.$emit("orderItem", itemJson);
      } else {
        this.$emit("orderItem");
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
            this.loading = true;
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            purchaseno: values.purchaseno,
            mitemcode: this.MitemCode,
            supplier: values.supplier,
          };
          getScmAction(parmas, "manualmatch/getpurchaseorders").then((res) => {
            if (res.data.success) {
              this.list = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch =true;
              this.loading = false;
            }
          });
          // do something
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if(this.isSearch){
          this.search();
          return
      }
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
