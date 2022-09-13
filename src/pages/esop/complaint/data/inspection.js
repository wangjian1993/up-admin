/*
 * @Author: max
 * @Date: 2022-09-09 08:57:17
 * @LastEditTime: 2022-09-13 10:55:42
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/complaint/data/inspection.js
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
        title: "日期",
        dataIndex: "UploadDatetime",
        scopedSlots: { customRender: "UploadDatetime" },
        align: "center",
    },
    {
        title: "订单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "客户代码",
        dataIndex: "CustomerCode",
        scopedSlots: { customRender: "CustomerCode" },
        align: "center",
    },
    {
        title: "常规型号",
        dataIndex: "ItemNo",
        scopedSlots: { customRender: "ItemNo" },
        align: "center",
    },
    {
        title: "客户型号",
        dataIndex: "CustomerNo",
        scopedSlots: { customRender: "CustomerNo" },
        align: "center",
    },
    {
        title: "不良现象",
        dataIndex: "UnpleasantSight",
        scopedSlots: { customRender: "UnpleasantSight" },
        align: "center",
    },
    {
        title: "图片",
        dataIndex: "Files",
        scopedSlots: { customRender: "Files" },
        align: "center",
    },
    {
        title: "后续执行标准",
        dataIndex: "ExecutiveStandard",
        scopedSlots: { customRender: "ExecutiveStandard" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];