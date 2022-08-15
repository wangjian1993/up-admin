/*
 * @Author: max
 * @Date: 2022-08-11 13:55:08
 * @LastEditTime: 2022-08-12 16:01:38
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/receiving/data/returnDetail.js
 */
export const info1 = [{
    title: '采购方',
    dataIndex: "PurchaseEnterprise"
}, {
    title: '退货单号',
    dataIndex: "DocNo"
}, {
    title: '供应商',
    dataIndex: "SupplierFullName"
}, {
    title: '退货日期',
    dataIndex: "DocDate"
}, {
    title: '退货类型',
    dataIndex: "PrintStatus"
}, {
    title: '是否换货',
    dataIndex: "IsReplace"
}];
export const info2 = [{
    title: '币种',
    dataIndex: "Currency"
}, {
    title: '交易税别',
    dataIndex: "TransactionTax"
}, {
    title: '付款条件',
    dataIndex: "PaymentTerm"
},{
    title: '备注',
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
        title: "收货单号",
        dataIndex: "ArrivalOrderNo",
        scopedSlots: { customRender: "ArrivalOrderNo" },
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
        title: "备注",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
        width: 80,
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