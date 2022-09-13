/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-09-07 15:22:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/financial/data/invoice.js
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
        title: "供应商名称",
        dataIndex: "SupplierFullName",
        scopedSlots: { customRender: "SupplierFullName" },
        align: "center",
    },
    {
        title: "发票通知单手",
        dataIndex: "InvoiceNo",
        scopedSlots: { customRender: "InvoiceNo" },
        align: "center",
    },
    {
        title: "发票信息",
        dataIndex: "InvoiceNo",
        scopedSlots: { customRender: "InvoiceNo" },
        align: "center",
    },
    {
        title: "发票部门",
        dataIndex: "InvoiceNo",
        scopedSlots: { customRender: "InvoiceNo" },
        align: "center",
    },
    {
        title: "发票类型",
        dataIndex: "InvoiceType",
        scopedSlots: { customRender: "InvoiceType" },
        align: "center",
    },
    {
        title: "来源",
        dataIndex: "InvoiceNo",
        scopedSlots: { customRender: "InvoiceNo" },
        align: "center",
    },
    {
        title: "发布人",
        dataIndex: "PublishUser",
        scopedSlots: { customRender: "PublishUser" },
        align: "center",
    },
    {
        title: "发布时间",
        dataIndex: "InvoiceDateTime",
        scopedSlots: { customRender: "InvoiceDateTime" },
        align: "center",
    },
    {
        title: "对账金额",
        dataIndex: "InvoiceMoneyTax",
        scopedSlots: { customRender: "InvoiceMoneyTax" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "Status",
        scopedSlots: { customRender: "Status" },
        align: "center",
    },
    {
        title: "审批状态",
        dataIndex: "DatetimeCreated",
        scopedSlots: { customRender: "DatetimeCreated" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];