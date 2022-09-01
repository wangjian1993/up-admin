/*
 * @Author: max
 * @Date: 2022-08-11 13:55:08
 * @LastEditTime: 2022-08-30 14:07:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/receiving/data/consigneeDetail.js
 */
//出库
export const info1 = [{
    title: '供应商',
    dataIndex: "SupplierFullName"
}, {
    title: '收货单号',
    dataIndex: "ArrivalOrderNo"
}, {
    title: '送货通知单号',
    dataIndex: "PurchaseOrderNo"
}, {
    title: '收货状态',
    dataIndex: "DifferenceReason"
}, {
    title: '收货日期',
    dataIndex: "ReceiptStatus"
}, {
    title: '送货日期',
    dataIndex: "DocDate"
}];
//入库
export const info4 = [{
    title: '供应商',
    dataIndex: "SupplierFullName"
}, {
    title: '入库单号',
    dataIndex: "ArrivalOrderNo"
}, {
    title: '送货通知单号',
    dataIndex: "PurchaseOrderNo"
}, {
    title: '入库状态',
    dataIndex: "DifferenceReason"
}, {
    title: '入库日期',
    dataIndex: "ReceiptStatus"
}, {
    title: '送货日期',
    dataIndex: "DocDate"
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
        title: "产品编码",
        dataIndex: "ItemCode",
        scopedSlots: { customRender: "ItemCode" },
        align: "center",
        width: 100,
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
    },
    {
        title: "采购说明",
        dataIndex: "DeliveryDatetime",
        scopedSlots: { customRender: "DeliveryDatetime" },
        align: "center",
        width: 80,
    },
    {
        title: "采购单号",
        dataIndex: "PurchaseOrderNo",
        scopedSlots: { customRender: "PurchaseOrderNo" },
        align: "center",
        width: 80,
    },
    {
        dataIndex: "Qty",   //采购数量
        scopedSlots: { customRender: "Qty" },
        slots: { title: "QtyTtile" },
        align: "center",
        width: 80,
    },
    {
        dataIndex: "PriceQty",  //计价数量
        scopedSlots: { customRender: "PriceQty" },
        slots: { title: "PriceQtyTitle" },
        align: "center",
        width: 80,
    },
    {
        dataIndex: "Price", //单位
        scopedSlots: { customRender: "Price" },
        slots: { title: "PriceTitle" },
        align: "center",
        width: 80,
    },
    {
        title: "收货仓库",
        dataIndex: "ReceiptWarehouse",
        scopedSlots: { customRender: "ReceiptWarehouse" },
        align: "center",
        width: 80,
    },
    {
        title: "收货单位",
        dataIndex: "Unit",
        scopedSlots: { customRender: "Unit" },
        align: "center",
        width: 80,
    },
    {
        title: "收货批号",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
        width: 80,
    },
    {
        dataIndex: "InStoreQty",   //入库数量
        scopedSlots: { customRender: "InStoreQty" },
        slots: { title: "InStoreQtyTtile" },
        align: "center",
        width: 80,
    },
];
export const columnKeys = [
    {
        title: "收货数量合计",
        dataIndex: "totalQty",
        scopedSlots: { customRender: "totalQty" },
        align: "center",
        width: 105,
    },
    {
        title: "计价数量合计",
        dataIndex: "priceQty",
        scopedSlots: { customRender: "priceQty" },
        align: "center",
        width: 105,
    },
]