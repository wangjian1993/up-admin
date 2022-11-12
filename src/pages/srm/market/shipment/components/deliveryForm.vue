<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-11-11 11:25:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/components/deliveryForm.vue
-->

<template>
  <div>
    <a-drawer :visible="visible" title="新建送货单" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '10px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item has-feedback label="客户" prop="suppliercode">
                <a-select style="width: 250px" placeholder="请选择客户" v-model="plantCode" :disabled="isEdit">
                  <a-select-option v-for="item in plantList" :key="item.Code" :value="item.Code">{{ item.Name }}</a-select-option>
                </a-select></a-form-model-item
              >
            </a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="送货单号" prop="orderno"><a-input placeholder="请输入送货单号" style="width: 220px" :disabled="isEdit" v-model="form.orderno"/></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="收货部门"> <a-select v-model="form.department" has-feedback placeholder="请选择收货部门"> </a-select></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="送货日期" prop="deliverydatetime"> <a-date-picker v-model="form.deliverydatetime" type="date" @change="deliveryChange" placeholder="选择送货日期" style="width: 100%;" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="预计到厂" prop="plandatetime"> <a-date-picker v-model="form.plandatetime" type="date" placeholder="选择送预计到厂" @change="plantChange" style="width: 100%;" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="到货时间" prop="arrivaldatetime"> <a-date-picker v-model="form.arrivaldatetime" @change="arrivalChange" type="date" placeholder="选择到货时间" style="width: 100%;" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="收货仓库" prop="receiptwarehouse"> <a-input v-model="form.receiptwarehouse" allowClear placeholder="请输入收货仓库" /> </a-form-model-item
            ></a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item has-feedback label="送货方式" prop="deliverytype">
                <a-select v-model="form.deliverytype" has-feedback placeholder="请选择送货方式" style="width: 200px">
                  <a-select-option v-for="item in paramsItem.DELIVER_MODE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select></a-form-model-item
              ></a-col
            >
            <a-col :span="6">
              <a-form-model-item has-feedback label="运输方式" prop="deliverymethod">
                <a-select v-model="form.shippingmethod" has-feedback placeholder="请选择送货方式" style="width: 200px">
                  <a-select-option v-for="item in paramsItem.DELIVER_MODE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="6">
              <a-form-model-item has-feedback label="送货地址" prop="deliveryaddress"> <a-input v-model="form.deliveryaddress" allowClear placeholder="请输入送货地址" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="联系方式" prop="deliveryphone"> <a-input v-model="form.deliveryphone" allowClear placeholder="请输入联系方式" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="送货备注" prop="deliveryremark"> <a-input v-model="form.deliveryremark" allowClear placeholder="请输入送货备注" /> </a-form-model-item
            ></a-col>
          </a-row>
        </a-card>
        <a-card class="card" title="送货明细" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <div style="display:flex;justify-content: flex-end;">
            <a-button type="primary" @click="addOrder(1)" icon="plus">按订单送货</a-button>
            <a-button style="margin-left: 8px" type="primary" @click="addOrder(2)" icon="plus">按退货送货</a-button>
          </div>
          <a-table :columns="columns" :data-source="detailList" size="small" :pagination="false" :rowKey="(list) => list.ItemCode" bordered>
            <template slot="footer">
              <a-table ref="total-table" class="total-table" :columns="columnKeys" :dataSource="totalData" :showHeader="false" :bordered="false" :pagination="false" size="small" />
            </template>
            <template slot="purchasedetailidTitle">
                <p>交货日期</p>
                <p>排定日期</p>
              </template>
              <template slot="purchasedetailid" slot-scope="text, record">
                <p>{{ record.DeliveryDatetime }}</p>
                <p>{{ record.PurchaseDatetime }}</p>
              </template>
              <template slot="deliveryqtyTitle">
                <p>送货数量</p>
                <p>送货单位</p>
              </template>
              <template slot="deliveryqty" slot-scope="text, record">
                <p>{{ record.DeliveryQty }}</p>
                <p>{{ record.DeliveryUnit }}</p>
              </template>
              <template slot="receiptQtyTitle">
                <p>交货数量</p>
                <p>排定单位</p>
              </template>
              <template slot="receiptQty" slot-scope="text, record">
                <p>{{ record.ReceiptQty }}</p>
                <p>{{ record.PurchaseQty }}</p>
              </template>
              <template slot="priceqtyTitle">
                <p>计价数量</p>
                <p>计价单位</p>
              </template>
              <template slot="priceqty" slot-scope="text, record">
                <p>{{ record.PriceQty }}</p>
                <p>{{ record.PriceUnit }}</p>
              </template>
            <template slot="receivingTitle">
              <p>收货数量</p>
              <p>入库数量</p>
              <p>退货数量</p>
            </template>
            <template slot="receiving" slot-scope="text, record">
              <p>{{ record.ReceiptWarehouse }}</p>
              <p>{{ record.PlanDatetime }}</p>
            </template>
            <template slot="action" slot-scope="text, record, index">
              <div>
                <a style="margin-right: 8px" @click="onDelete(index)">
                  <a-icon type="delete" />
                  删除
                </a>
              </div>
            </template>
          </a-table>
        </a-card>
      </a-form-model>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" :style="{ marginRight: '8px' }" :loading="loading" @click="handleOk('SAVE')">
          保存
        </a-button>
      </div>
    </a-drawer>
    <OrderList v-if="isAddOrder" :orderType="orderType" :plantCode="plantCode" :orderList="detailList" @closeModal="closeModal" @success="setTableData" />
  </div>
</template>

<script>
import { setClientDelivery, getClientDelivery } from "@/services/srm.js";
import moment from "moment";
import { columns, columnKeys } from "../data/addDelivery.js";
import OrderList from "./orderList.vue";
export default {
  props: ["isEdit", "paramsItem", "orderId"],
  components: { OrderList },
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      columnKeys,
      totalData: [
        {
          totalQty: "送货总数:0",
          totalMoney: "订单金额:0",
        },
      ],
      detailList: [],
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        orderno: "",
        purchaseenterprise: "",
        department: "",
        purchasedescription: "",
        deliverydatetime: "",
        receiptwarehouse: "",
        plandatetime: "",
        arrivaldatetime: "",
        codeversion: "",
        deliverytype: "",
        currentusername: "",
        deliverymethod: "",
        shippingmethod: "",
        deliveryremark: "",
        deliveryaddress: "",
        deliveryphone: "",
        children: [],
      },
      rules: {
        orderno: [
          {
            required: true,
            message: "请输入送货单号",
            trigger: "blur",
          },
        ],
        receiptwarehouse: [
          {
            required: true,
            message: "请输入收货仓库",
            trigger: "blur",
          },
        ],
        deliverytype: [
          {
            required: true,
            message: "请输入送货方式",
            trigger: "blur",
          },
        ],
        deliveryaddress: [
          {
            required: true,
            message: "请输入送货地址",
            trigger: "blur",
          },
        ],
        deliverydatetime: [
          {
            required: true,
            message: "请选择送货日期",
            trigger: "change",
          },
        ],
        plandatetime: [
          {
            required: true,
            message: "请选择预计到厂",
            trigger: "change",
          },
        ],
        arrivaldatetime: [
          {
            required: true,
            message: "请选择到货时间",
            trigger: "change",
          },
        ],
      },
      departmentalList: [],
      isUser: false,
      user: [],
      dynamicValidateForm: [],
      addUserIndex: -1,
      rawData: [],
      userList: [],
      userType: "",
      loading: false,
      orderType: "",
      isAddOrder: false,
      plantList: [],
      plantCode: "",
    };
  },
  created() {
    this.getPlantList();
  },
  methods: {
    moment,
    close() {
      this.$emit("closeModal");
    },
    getDetailList() {
      this.loading = true;
      let params = {
        id: this.orderId,
      };
      getClientDelivery(params, "single").then((res) => {
        if (res.data.success) {
          let orderList = res.data.data.order;
          this.detailList = res.data.data.detail;
          let plant = this.plantList.find((item) => item.Name == orderList.PurchaseEnterprise);
          console.log("plant===",plant)
          this.plantCode = plant.Code;
          this.form = {
            id: this.orderId,
            orderno: orderList.OrderNo,
            purchaseenterprise: orderList.PurchaseEnterprise,
            department: orderList.Department,
            purchasedescription: orderList.PurchaseDescription,
            deliverydatetime: orderList.DeliveryDatetime,
            receiptwarehouse: orderList.ReceiptWarehouse,
            plandatetime: orderList.PlanDatetime,
            arrivaldatetime: orderList.ArrivalDatetime,
            codeversion: orderList.CodeVersion,
            deliverytype: orderList.DeliveryType,
            currentusername: "",
            deliverymethod: orderList.DeliveryMethod,
            shippingmethod: orderList.ShippingMethod,
            deliveryremark: orderList.DeliveryRemark,
            deliveryaddress: orderList.DeliveryAddress,
            deliveryphone: orderList.DeliveryPhone,
            children: [],
          };
          let qty = 0;
          let price = 0;
          this.detailList.forEach((item) => {
            qty += item.DeliveryQty;
            price += item.PriceQty;
          });
          this.totalData = [
            {
              totalQty: "收货数量合计:" + qty,
              priceQty: "计价数量合计:" + price,
            },
          ];
        }
        this.loading = false;
      });
    },
    deliveryChange(e, stringData) {
      console.log(e);
      this.form.deliverydatetime = stringData;
      console.log(stringData);
    },
    plantChange(e, stringData) {
      console.log(e);
      this.form.plandatetime = stringData;
      console.log(stringData);
    },
    arrivalChange(e, stringData) {
      console.log(e);
      this.form.arrivaldatetime = stringData;
      console.log(stringData);
    },
    closeModal() {
      this.isUser = false;
      this.isAddOrder = false;
    },
    setTableData(list) {
      this.detailList = list;
      this.CalculateTotals();
    },
    getPlantList() {
      getClientDelivery("", "getclient").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          if (this.isEdit) {
            this.getDetailList();
          }
        }
      });
    },
    CalculateTotals() {
      let qty = 0;
      let price = 0;
      this.detailList.forEach((item) => {
        qty += item.PriceQty;
        price += item.Amount || item.Money;
      });
      this.totalData = [
        {
          totalQty: "订单数量:" + qty,
          totalMoney: "订单金额:" + price,
        },
      ];
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    onDelete(index) {
      this.detailList.splice(index, 1);
      this.CalculateTotals();
    },
    addOrder(type) {
      if (this.plantCode == "") {
        this.$message.warning("清先选择客户");
        return;
      }
      this.isAddOrder = true;
      this.orderType = type;
    },
    handleOk() {
      this.loading = true;
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          let plant = this.plantList.find((item) => item.Code == this.plantCode);
          this.form.purchaseenterprise = plant.Name;
          this.detailList.forEach((item) => {
            this.form.children.push({
              orderno: item.OrderNo || item.PurchaseOrderNo,
              sort: item.Sort || 0,
              returnorderno: item.ReturnOrderNo || "", // 退货单号
              returnsort: item.ReturnSort || 0, // 退货明细项次
              deliverydatetime: item.DeliveryDatetime || "",
              deliveryqty: item.Qty || item.DeliveryQty,
              deliveryunit: item.Unit || item.DeliveryUnit,
              priceqty: item.PriceQty || "",
              priceunit: item.PriceUnit || "",
              deliveryremark: item.Remark || "",
            });
          });
          let url = this.isEdit ?'update':'add'
          setClientDelivery(this.form,url).then((res) => {
            if (res.data.success) {
              let content = this.isEdit ?'编辑成功':'新建成功'
              this.$message.success(content);
              this.$emit("closeModal");
              this.$emit("success");
              this.visible = false;
            }
            this.loading = false;
          });
        } else {
          this.loading = false;
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
/deep/ .ant-card-head-title {
  padding: 0px 0;
}
/deep/ .ant-card-head {
  min-height: 0;
}
</style>
