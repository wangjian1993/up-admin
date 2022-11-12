/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-11-11 11:26:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/data/addDelivery.js
 */
// import { splitData } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
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
    },
    {
        title: "产品规格",
        dataIndex: "ItemSpecification",
        scopedSlots: { customRender: "ItemSpecification" },
        align: "center",
        width: 350
    },
    {
        title: "客户单号(项次)",
        dataIndex: "OrderNoDesc",
        scopedSlots: { customRender: "OrderNoDesc" },
        align: "center",
    },
    {
        title: "退货单号(项次)",
        dataIndex: "ReturnOrderNoDesc",
        scopedSlots: { customRender: "ReturnOrderNoDesc" },
        align: "center",
    },
    {
        title: "收货仓库",
        dataIndex: "PurchaseWarehouse",
        scopedSlots: { customRender: "PurchaseWarehouse" },
        align: "center",
    },
    {
        dataIndex: "purchasedetailid",  //交货日期
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
        dataIndex: "ReceiptWarehouse",  //送货数量
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
        title: "备注",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];

export const columnKeys = [
    {
        title: "送货数量",
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
]