<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-24 14:45:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/order/edit.vue
-->

<template>
  <div>
    <a-modal title="订单明细" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="60%">
      <a-descriptions size="small">
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
          <a-input v-model="editData.MobilePhone" placeholder="请输入手机号" />
        </a-descriptions-item>
        <a-descriptions-item label="用餐人数">
          <a-input-number :min="0" v-model="editData.Count" placeholder="请输入手机号" />
        </a-descriptions-item>
        <a-descriptions-item label="配送时间">
          <a-date-picker show-time v-model="editData.DispatchTime"> </a-date-picker>
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          <a-input v-model="editData.Remark" placeholder="请输入备注" />
        </a-descriptions-item>
      </a-descriptions>
      <a-card class="card" title="购物车" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-list :grid="{ gutter: 16, md: 5, lg: 5 }" item-layout="horizontal" size="small" :data-source="goods">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta>
              <a slot="title">{{ item.GoodsName }}</a>
              <p slot="description">数量: <a-input-number :min="0" v-model="item.Qty"></a-input-number></p>
              <!-- <a-avatar slot="avatar" src="./shanchu.png" /> -->
              <img slot="avatar" @click="delGoods(index)" style="width: 20px; height: 20px;cursor: pointer;" src="@/assets/img/shanchu-2.png" alt="" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
      <a-card class="card" title="商品" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <div v-for="item in goodsList" :key="item.Id">
          <a-list :grid="{ gutter: 16, md: 5, lg: 5 }" v-if="item.Goods.length > 0" :item-layout="horizontal" size="small" :data-source="item.Goods">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="'数量 x ' + item.Qty">
                <a slot="title">{{ item.GoodsName }}</a>
                <img slot="avatar" @click="addGoods(item)" style="width: 20px; height: 20px;cursor: pointer;" src="@/assets/img/tianjia.png" alt="" />
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import { getOrderList, getOrderAddress, setOrderList } from "@/services/ors.js";
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      goods: [],
      orderInfo: [],
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
      goodsList: [],
    };
  },
  created() {
    this.getOrderList();
    this.getGoodsList();
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
    },
    getGoodsList() {
      let params = {
        addressid: this.editData.AddressId,
      };
      getOrderAddress(params, "getgoodsbyaddressid").then((res) => {
        this.goodsList = res.data.data.Classifys;
        console.log(this.goodsList);
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
    addGoods(goods) {
      let goodsIndex = this.goods.findIndex((item) => item.Id === goods.Id);
      if (goodsIndex > -1) {
        this.goods[goodsIndex].Qty += 1;
      } else {
        goods.Qty = 1;
        this.goods.push(goods);
      }
    },
    delGoods(index) {
      this.goods.splice(index, 1);
    },
    handleOk() {
      let params = {
        id: this.editData.Id,
        addressid: this.editData.AddressId,
        mobilephone: this.editData.MobilePhone,
        count: this.editData.Count,
        remark: this.editData.Remark,
        dispatchtime: this.editData.DispatchTime,
        children: [],
      };
      this.goods.forEach((item) => {
        params.children.push({
          id: item.Id,
          classifyname: item.ClassifyName,
          goodscode: item.GoodsCode,
          goodsname: item.GoodsName,
          pictureid: item.PictureId || "",
          isrecommend: item.IsRecommend,
          unit: item.Unit,
          qty: item.Qty,
          price: item.Price,
          sort: item.Sort,
          goodsdesc: item.GoodsDesc,
        });
      });
      setOrderList(params, "update").then((res) => {
        if (res.data.success) {
          this.$message.success("编辑成功!");
          this.$emit("closeModal");
          this.$emit("success");
          this.visible = false;
        }
      });
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
.goods-list {
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
/deep/.ant-modal-body{
  height: 650px;
  overflow: auto;
}
</style>
