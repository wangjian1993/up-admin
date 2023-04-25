<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2023-03-21 14:05:57
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/qrcode/printList.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="IsRePrint == 'Y' ? '补打产品追溯码' : '打印产品追溯码'" @cancel="close" @ok="handleOk" centered width="70%">
      <div>
        <a-form layout="horizontal" :form="searchForm">
          <div>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="序号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input-number :min="0" allowClear placeholder="请输入序号" v-decorator="['startsortno']" />
                  <span>-</span>
                  <a-input-number :min="0" allowClear placeholder="请输入序号" v-decorator="['ensortno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <span>
                  <a-button type="primary" @click="searchBtn">查询</a-button>
                  <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </div>
        </a-form>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            v-if="IsRePrint == 'Y'"
            :columns="columns"
            :data-source="dataSource"
            :size="size"
            :pagination="pagination"
            :rowKey="(orderSelectList) => orderSelectList.QrId"
            :scroll="{ y: 500 }"
            bordered
            @change="handleTableChange" 
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
          <a-table v-else :columns="columns" :data-source="dataSource" :size="size" :pagination="pagination" :rowKey="(orderSelectList) => orderSelectList.QrId" @change="handleTableChange" :scroll="{ y: 500 }" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
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
    title: "工单号",
    dataIndex: "MoCode",
    scopedSlots: { customRender: "MoCode" },
    align: "center",
    width: 120,
  },
  {
    title: "追溯码",
    dataIndex: "QrCode",
    scopedSlots: { customRender: "QrCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
    width: 120,
  },
  {
    title: "品名",
    dataIndex: "ProName",
    scopedSlots: { customRender: "ProName" },
    align: "center",
    width: 120,
  },
  {
    title: "完工时间",
    dataIndex: "DateTimeFinished",
    scopedSlots: { customRender: "DateTimeFinished" },
    align: "center",
    width: 120,
  },
  {
    title: "首次打印时间",
    dataIndex: "DateTimePrint",
    scopedSlots: { customRender: "DateTimePrint" },
    align: "center",
    width: "80px",
  },
  {
    title: "首次打印人",
    dataIndex: "DateTimeReprint",
    scopedSlots: { customRender: "DateTimeReprint" },
    align: "center",
    width: "80px",
  },
  {
    title: "已打印次数",
    dataIndex: "PrintCount",
    scopedSlots: { customRender: "PrintCount" },
    align: "center",
    width: "80px",
  },
];
import { splitData } from "@/utils/util.js";
import { getQrCodeList } from "@/services/mes.js";
export default {
  props: ["orderInfo", "IsRePrint"],
  data() {
    return {
      dataSource: [],
      columns,
      size: "small",
      visible: true,
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
      isPrint: false,
      printData: [],
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.searchBtn();
  },
  methods: {
    splitData,
    closeModal() {
      this.isPrint = true;
    },
    close() {
      this.$emit("closeModal");
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    reset() {
      this.searchBtn();
      this.searchForm.resetFields();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            mocode: this.orderInfo.MoCode,
            isreprint: this.IsRePrint,
            startsortno: values.startsortno,
            ensortno: values.ensortno,
          };
          getQrCodeList(params, "getprintlist").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = 2;
            }
          });
          // do something
        }
      });
    },
    getPrintList() {
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        LineId: this.orderInfo.LineId,
        MoCode: this.orderInfo.MoCode,
        IsRePrint: this.IsRePrint,
      };
      getQrCodeList(params, "getprints").then((res) => {
        console.log("res----", res);
        if (res.data.success) {
          this.data = res.data.data;
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
    },
    handleOk() {
      // if (this.IsRePrint == "Y" && this.selectedRowKeys.length == 0) {
      //   this.$message.warn("请先选择要补打的工单");
      //   return;
      // }
      let list = [];
      // if (this.IsRePrint == "Y") {
      //   this.dataSource.forEach((row) => {
      //     if (this.selectedRowKeys.includes(row.QrId)) {
      //       list.push(row);
      //     }
      //   });
      //   this.$emit("success", list);
      // } else {
        let values = this.searchForm.getFieldsValue();
        let params = {
          pageindex: this.pagination.current,
          pagesize: this.pagination.total,
          mocode: this.orderInfo.MoCode,
          isreprint: this.IsRePrint,
          startsortno: values.startsortno,
          ensortno: values.ensortno,
        };
        getQrCodeList(params, "getprintlist").then((res) => {
          if (res.data.success) {
            list = res.data.data.list;
            console.log("list====", list);
            this.$emit("success", list);
          }
        });
      // }
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
/deep/.ant-table {
  min-height: 0vh;
}
</style>
