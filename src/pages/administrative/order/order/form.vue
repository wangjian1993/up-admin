<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-24 09:52:25
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/order/form.vue
-->

<template>
  <div>
    <a-modal title="订单明细" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="60%">
      <a-descriptions>
        <a-descriptions-item label="订单号">
          {{ editData.OrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="招待公司">
          {{ editData.CompanyName }}
        </a-descriptions-item>
        <a-descriptions-item label="点单地点">
          {{ editData.Place }}
        </a-descriptions-item>
        <a-descriptions-item label="点单人">
          {{ editData.CreateUser }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号">
          {{ editData.MobilePhone }}
        </a-descriptions-item>
        <a-descriptions-item label="用餐人数">
          {{ editData.Count }}
        </a-descriptions-item>
        <a-descriptions-item label="配送时间">
          {{ editData.DispatchTime }}
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          {{ editData.Remark }}
        </a-descriptions-item>
      </a-descriptions>
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-list item-layout="horizontal" :data-source="goods">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta :description="'数量 x ' + item.Qty">
              <a slot="title">{{ item.GoodsName }}</a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <a-list size="small" bordered :data-source="orderInfo">
          <a-list-item slot="renderItem" slot-scope="item">
            {{ item.Info }}
          </a-list-item>
        </a-list>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import { getOrderList } from "@/services/ors.js";
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      goods: [],
      orderInfo:[],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 100, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        orderid: this.editData.Id,
      };
      getOrderList(params, "detail/get").then((res) => {
        this.goods = res.data.data.list;
        console.log(this.goods);
      });
      getOrderList(params, "log/get").then((res) => {
        this.orderInfo = res.data.data.list;
      });
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    setUserList(list) {
      this.user = list;
    },
    handleClose(id) {
      this.user = this.user.filter((item) => item.Id != id);
    },
    addUser() {
      this.isUser = true;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {},
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
