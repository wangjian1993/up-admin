/*
 * @Author: max
 * @Date: 2022-09-09 08:57:17
 * @LastEditTime: 2022-09-09 09:12:14
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/complaint/data/list.js
 */

// import { splitData } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: "5%",
    },
    {
        title: "客诉日期",
        dataIndex: "UploadDatetime",
        scopedSlots: { customRender: "UploadDatetime" },
        align: "center",
    },
    {
        title: "客户名称",
        dataIndex: "CustomerName",
        scopedSlots: { customRender: "CustomerName" },
        align: "center",
    },
    {
        title: "业务员",
        dataIndex: "BusinessUser",
        scopedSlots: { customRender: "BusinessUser" },
        align: "center",
    },
    {
        title: "订单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "产品型号",
        dataIndex: "ItemCode",
        scopedSlots: { customRender: "ItemCode" },
        align: "center",
    },
    {
        title: "产品类别",
        dataIndex: "ItemType",
        scopedSlots: { customRender: "ItemType" },
        align: "center",
    },
    {
        title: "出货日期",
        dataIndex: "SaleDatetime",
        scopedSlots: { customRender: "SaleDatetime" },
        align: "center",
    },
    {
        title: "出货数量",
        dataIndex: "Qty",
        scopedSlots: { customRender: "Qty" },
        align: "center",
    },
    {
        title: "不良数",
        dataIndex: "NgQty",
        scopedSlots: { customRender: "NgQty" },
        align: "center",
    },
    {
        title: "不良率",
        dataIndex: "NgRate",
        scopedSlots: { customRender: "NgRate" },
        align: "center",
    },
    {
        title: "不良描述",
        dataIndex: "NgDesc",
        scopedSlots: { customRender: "NgDesc" },
        align: "center",
    },
    {
        title: "分析结果",
        dataIndex: "AnalysisResults",
        scopedSlots: { customRender: "AnalysisResults" },
        align: "center",
    },
    {
        title: "责任部门",
        dataIndex: "Department",
        scopedSlots: { customRender: "Department" },
        align: "center",
    },
    {
        title: "8D报告号",
        dataIndex: "ReportNo",
        scopedSlots: { customRender: "ReportNo" },
        align: "center",
    },
    {
        title: "8D报告回复日期",
        dataIndex: "ReportDatetime",
        scopedSlots: { customRender: "ReportDatetime" },
        align: "center",
    },
    {
        title: "改善对策",
        dataIndex: "ImproveStrategy",
        scopedSlots: { customRender: "ImproveStrategy" },
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