<template>
    <div>
      <a-modal v-model="visible" title="交易权限" @cancel="close" @ok="handleOk" centered width="70%">
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table
              :columns="columns"
              :data-source="dataSource"
              :size="size"
              :pagination="pagination"
              :scroll="{ y: 550 }"
              :rowKey="(dataSource,index) => dataSource.ProCode + '_' + index"
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
          </a-card>
      </a-modal>
    </div>
  </template>
  <script>
  const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width: 50,
    },
    {
      title: "ERP员工编码",
      dataIndex: "PlantName",
      scopedSlots: { customRender: "PlantName" },
      align: "center",
    },
    {
      title: "员工姓名",
      dataIndex: "ProCode",
      scopedSlots: { customRender: "ProCode" },
      align: "center",
    },
    {
      title: "员工岗位",
      dataIndex: "ProName",
      scopedSlots: { customRender: "ProName" },
      align: "center",
    },
  ];
  import { getSupplierAction } from "@/services/srm.js";
  export default {
    props: ["authorityId"],
    data() {
      return {
        dataSource: [],
        columns,
        size: "small",
        visible: true,
        selectedRowKeys: [],
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
      };
    },
    created() {
      this.getListAll();
    },
    methods: {
      getListAll() {
        this.loading = true;
        let params = {
            id :this.authorityId
        };
        getSupplierAction(params, "gettransaction").then((res) => {
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
      close() {
        this.$emit("closeModal");
      },
    },
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
  /deep/.ant-form-item {
    margin-bottom: 5px;
  }
  </style>
  