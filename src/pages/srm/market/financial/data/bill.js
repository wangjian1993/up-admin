/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-12-29 17:45:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/financial/data/bill.js
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
        title: "收货部门",
        dataIndex: "PurchaseDatetime",
        scopedSlots: { customRender: "PurchaseDatetime" },
        align: "center",
    },
    {
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
        slots: { title: "OrderNoTitle" },
    },
    {
        title: "币别",
        dataIndex: "PurchaseUser",
        scopedSlots: { customRender: "PurchaseUser" },
        align: "center",
    },
    {
        dataIndex: "BillCycle",
        scopedSlots: { customRender: "BillCycle" },
        align: "center",
        slots: { title: "BillCycleTitle" },
    },
    {
        dataIndex: "BillCycle",
        scopedSlots: { customRender: "BillCycle" },
        align: "center",
        slots: { title: "BillCycleTitle" },
    },
    {
        dataIndex: "BillCycle",
        scopedSlots: { customRender: "BillCycle" },
        align: "center",
        slots: { title: "BillCycleTitle" },
    },
    {
        dataIndex: "Source",
        scopedSlots: { customRender: "Source" },
        align: "center",
        slots: { title: "SourceTitle" },
    },
    {
        title: "发票",
        dataIndex: "InvoiceStatus",
        scopedSlots: { customRender: "InvoiceStatus" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "Status",
        scopedSlots: { customRender: "Status" },
        align: "center",
    },
    {
        title: "签章状态",
        dataIndex: "DatetimeCreated",
        scopedSlots: { customRender: "DatetimeCreated" },
        align: "center",
    },
    {
        title: "审批状态",
        dataIndex: "PurchaseStatus",
        scopedSlots: { customRender: "PurchaseStatus" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];