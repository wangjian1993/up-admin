/*
 * @Author: max
 * @Date: 2022-08-11 13:55:08
 * @LastEditTime: 2022-11-03 15:03:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/data/consigneeDetail.js
 */
export const info1 = [{
    title: '客户',
    dataIndex: "PurchaseEnterprise"
}, {
    title: '送货单号',
    dataIndex: "OrderNo"
}, {
    title: '收货部门',
    dataIndex: "Department"
}, {
    title: '送货日期',
    dataIndex: "DeliveryDatetime"
}, {
    title: '供应商',
    dataIndex: "SupplierFullName"
}, {
    title: '采购说明',
    dataIndex: "PurchaseDescription"
}, {
    title: '预计到场',
    dataIndex: "PlanDatetime"
}, {
    title: '条码版本',
    dataIndex: "CodeVersion"
}, {
    title: '收货仓库',
    dataIndex: "ReceiptWarehouse"
}, {
    title: '送货状态',
    dataIndex: "DeliveryStatus"
}, {
    title: '送检状态',
    dataIndex: "InspectionStatus"
}, {
    title: '送货类型',
    dataIndex: "DeliveryType"
}, {
    title: '到货时间',
    dataIndex: "ArrivalDatetime"
}, {
    title: '采购类型',
    dataIndex: "ShippingMethod"
}, {
    title: '制单人',
    dataIndex: "PublishUser"
}];
export const info2 = [{
    title: '采购单号',
    dataIndex: "PurchaseOrderNo"
}, {
    title: '采购类型',
    dataIndex: "TransactionTax"
}, {
    title: '币别',
    dataIndex: "Currency"
}, {
    title: '采购日期',
    dataIndex: "PurchaseUser"
}, {
    title: '交易税别',
    dataIndex: "TransactionTax"
}, {
    title: '付款条件',
    dataIndex: "PaymentTerm"
}, {
    title: '单别',
    dataIndex: "DocType"
}];
export const info3 = [{
    title: '送货方式',
    dataIndex: "DeliveryMethod"
}, {
    title: '运输方式',
    dataIndex: "ShippingMethod"
}, {
    title: '送货备注',
    dataIndex: "DeliveryRemark"
}, {
    title: '送货地址',
    dataIndex: "DeliveryAddress"
}, {
    title: '联系方式',
    dataIndex: "DeliveryPhone"
}, {
    title: '物流状态',
    dataIndex: "ShippingStatus"
}, {
    title: '订单备注',
    dataIndex: "Remark"
}];
export const columns = [
    {
        title: "项次",
        dataIndex: "Sort",
        scopedSlots: { customRender: "Sort" },
        align: "center",
      },
      {
        title: "产品编码",
        dataIndex: "ItemCode",
        scopedSlots: { customRender: "ItemCode" },
        align: "center",
      },
      {
        title: "产品名称",
        dataIndex: "ItemName",
        scopedSlots: { customRender: "ItemName" },
        align: "center",
        width: 150,
      },
      {
        title: "产品规格",
        dataIndex: "ItemSpecification",
        scopedSlots: { customRender: "ItemSpecification" },
        align: "center",
        width: 350,
      },
      {
        title: "客户单号(项次)",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
      },
      {
        title: "收货仓库",
        dataIndex: "PurchaseWarehouse",
        scopedSlots: { customRender: "PurchaseWarehouse" },
        align: "center",
      },
      {
        dataIndex: "purchasedetailid", //交货日期
        scopedSlots: { customRender: "purchasedetailid" },
        slots: { title: "purchasedetailidTitle" },
        align: "center",
      },
      {
        dataIndex: "deliveryqty", //交货数量
        scopedSlots: { customRender: "deliveryqty" },
        slots: { title: "deliveryqtyTitle" },
        align: "center",
      },
      {
        dataIndex: "ReceiptWarehouse", //送货数量
        scopedSlots: { customRender: "ReceiptWarehouse" },
        slots: { title: "ReceiptWarehouseTitle" },
        align: "center",
      },
      {
        dataIndex: "priceqty", //计价数量
        scopedSlots: { customRender: "priceqty" },
        slots: { title: "priceqtyTitle" },
        align: "center",
      },
      {
        title: "订单备注",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
      },
]