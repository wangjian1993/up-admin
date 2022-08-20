/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-08-16 09:42:10
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/order/data/list.js
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
        title: "客户名称",
        dataIndex: "PurchaseEnterprise",
        scopedSlots: { customRender: "PurchaseEnterprise" },
        align: "center",
    },
    {
        title: "客户单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "采购日期",
        dataIndex: "PurchaseDatetime",
        scopedSlots: { customRender: "PurchaseDatetime" },
        align: "center",
    },
    {
        title: "采购员",
        dataIndex: "PurchaseUser",
        scopedSlots: { customRender: "PurchaseUser" },
        align: "center",
    },
    {
        title: "采购备注",
        dataIndex: "Remark",
        scopedSlots: { customRender: "Remark" },
        align: "center",
    },
    {
        title: "差异原因",
        dataIndex: "DifferenceReason",
        scopedSlots: { customRender: "DifferenceReason" },
        align: "center",
    },
    {
        title: "订单金额",
        dataIndex: "OrderAmount",
        scopedSlots: { customRender: "OrderAmount" },
        align: "center",
    },
    {
        title: "订单状态",
        dataIndex: "PurchaseStatus",
        scopedSlots: { customRender: "PurchaseStatus" },
        align: "center",
    },
    {
        title: "送货状态",
        dataIndex: "ReceiptStatus",
        scopedSlots: { customRender: "ReceiptStatus" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];