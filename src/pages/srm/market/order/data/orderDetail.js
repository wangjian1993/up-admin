/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-08-16 13:55:27
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/order/data/orderDetail.js
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
        title: "物料编码",
        dataIndex: "ItemCode",
        scopedSlots: { customRender: "ItemCode" },
        align: "center",
    },
    {
        title: "物料名称",
        dataIndex: "ItemName",
        scopedSlots: { customRender: "ItemName" },
        align: "center",
    },
    {
        title: "物料规格",
        dataIndex: "ItemSpecification",
        scopedSlots: { customRender: "ItemSpecification" },
        align: "center",
        width: 300,
    },
    {
        title: "采购单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "项次",
        dataIndex: "Sort",
        scopedSlots: { customRender: "Sort" },
        align: "center",
    },
    {
        title: "供应商",
        dataIndex: "SupplierFullName",
        scopedSlots: { customRender: "SupplierFullName" },
        align: "center",
    },
    {
        title: "采购日期",
        dataIndex: "PurchaseDatetime",
        scopedSlots: { customRender: "PurchaseDatetime" },
        align: "center",
    },
    {
        title: "采购员编码",
        dataIndex: "DatetimeCreated",
        scopedSlots: { customRender: "DatetimeCreated" },
        align: "center",
    },
    {
        title: "采购员",
        dataIndex: "PurchaseUser",
        scopedSlots: { customRender: "PurchaseUser" },
        align: "center",
    },
];