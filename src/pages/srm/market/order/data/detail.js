/*
 * @Author: max
 * @Date: 2022-08-11 13:55:08
 * @LastEditTime: 2022-11-02 10:07:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/order/data/detail.js
 */
export const info1 = [{
    title: '客户',
    dataIndex: "PurchaseEnterprise"
}, {
    title: '客户单号',
    dataIndex: "OrderNo"
}, {
    title: '供应商',
    dataIndex: "SupplierFullName"
}, {
    title: '采购类型',
    dataIndex: "PurchaseType"
}, {
    title: '打印状态',
    dataIndex: "PrintStatus"
}, {
    title: '差异原因',
    dataIndex: "DifferenceReason"
}, {
    title: '送货状态',
    dataIndex: "ReceiptStatus"
}, {
    title: '订单状态',
    dataIndex: "PurchaseStatus"
}, {
    title: '订单附件',
    dataIndex: "FilePath"
}];
export const info2 = [{
    title: '采购日期',
    dataIndex: "PurchaseDatetime"
}, {
    title: '交易税别',
    dataIndex: "TransactionTax"
}, {
    title: '币别',
    dataIndex: "Currency"
}, {
    title: '采购员',
    dataIndex: "PurchaseUser"
}, {
    title: '付款条件',
    dataIndex: "PaymentTerm"
}];
export const info3 = [{
    title: '物流方式',
    dataIndex: "ShippingMethod"
}, {
    title: '收货地址',
    dataIndex: "ShippingAddress"
}, {
    title: '订单备注',
    dataIndex: "Remark"
}];
export const columns = [
    {
        title: "项次",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        dataIndex: "product_info",  //产品
        scopedSlots: { customRender: "product_info" },
        slots: { title: "productTitle" },
        align: "left",
        width: 110,
    },
    {
        dataIndex: "PurchaseWarehouse",   //收货仓位
        scopedSlots: { customRender: "PurchaseWarehouse" },
        slots: { title: "PurchaseWarehouseTitle" },
        align: "left",
        width: 100,
    },
    {
        dataIndex: "DrawingNo",  //图号
        scopedSlots: { customRender: "DrawingNo" },
        slots: { title: "DrawingNoTitle" },
        align: "left",
        width: 200,
    },
    {
        title: "交货日期",
        dataIndex: "DeliveryDatetime",
        scopedSlots: { customRender: "DeliveryDatetime" },
        align: "center",
        width: 75,
    },
    {
        dataIndex: "Qty",   //采购数量
        scopedSlots: { customRender: "Qty" },
        slots: { title: "QtyTtile" },
        align: "center",
        width: 50,
    },
    {
        dataIndex: "PriceQty",  //计价数量
        scopedSlots: { customRender: "PriceQty" },
        slots: { title: "PriceQtyTitle" },
        align: "center",
        width: 75,
    },
    {
        dataIndex: "Price", //单位
        scopedSlots: { customRender: "Price" },
        slots: { title: "PriceTitle" },
        align: "center",
        width: 80,
    },
    {
        dataIndex: "MoneyTax",  //含税金额
        scopedSlots: { customRender: "MoneyTax" },
        slots: { title: "MoneyTaxTitle" },
        align: "center",
        width: 50,
    },
    {
        title: "备注",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
        width: 80,
    },
    {
        title: "附件",
        dataIndex: "FilePath",
        scopedSlots: { customRender: "FilePath" },
        align: "center",
        width: 80,
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        width: 105,
    },
];
export const columnKeys = [
    {
        title: "订单数量",
        dataIndex: "totalQty",
        scopedSlots: { customRender: "totalQty" },
        align: "center",
        width: 105,
    },
    {
        title: "订单金额",
        dataIndex: "totalMoney",
        scopedSlots: { customRender: "totalMoney" },
        align: "center",
        width: 105,
    },
    {
        title: "交货金额",
        dataIndex: "totalOrderMoney",
        scopedSlots: { customRender: "totalOrderMoney" },
        align: "center",
        width: 105,
    },
]
export const innerColumns = [
    {
        title: "变更信息",
        dataIndex: "Type",
        scopedSlots: { customRender: "Type" },
        align: "center",
    },
    {
        title: "交货日期",
        dataIndex: "ChangeDatetime",
        scopedSlots: { customRender: "ChangeDatetime" },
        align: "center",
    },
    {
        title: "采购数量",
        dataIndex: "ChangeQty",
        scopedSlots: { customRender: "ChangeQty" },
        align: "center",
    },
    {
        title: "单价",
        dataIndex: "ChangePrice",
        scopedSlots: { customRender: "ChangePrice" },
        align: "center",
    },
    {
        title: "金额",
        dataIndex: "ChangeAmount",
        scopedSlots: { customRender: "ChangeAmount" },
        align: "center",
    },
    {
        title: "备注",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        width: 105,
    },
]