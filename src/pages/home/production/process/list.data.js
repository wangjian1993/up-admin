/*
 * @Author: max
 * @Date: 2021-12-24 09:42:09
 * @LastEditTime: 2021-12-31 10:20:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/list.data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width:50,
    },
    {
        title: "计划批号",
        dataIndex: "BatchNo",
        scopedSlots: { customRender: "BatchNo" },
        align: "center",
        width:120,
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
        width:100,
    },
    {
        title: "PMC",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
        width:100,
    },
    {
        title: "计划生产日期",
        dataIndex: "PlanDate",
        scopedSlots: { customRender: "PlanDate" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return splitData(text);
        }
    },
    {
        title: "工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 120,
    },
    {
        title: "业务订单号",
        dataIndex: "SalesOrderNo",
        scopedSlots: { customRender: "SalesOrderNo" },
        align: "center",
        width:120,
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width:120,
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width:220,
    },
    {
        title: " 订单交期",
        dataIndex: "Spec",
        align: "center",
        width:120,
    },
    {
        title: "下单日期",
        dataIndex: "DateCreated",
        scopedSlots: { customRender: "DateCreated" },
        align: "center",
        width:130,
    },
    {
        title: "订单数量",
        dataIndex: "MoQty",
        scopedSlots: { customRender: "MoQty" },
        align: "center",
        width: 80,
    },
    {
        title: "计划数量",
        dataIndex: "PlanQty",
        scopedSlots: { customRender: "PlanQty" },
        align: "center",
        width: "100px",
    },
    {
        title: "生产车间",
        dataIndex: "WorkshopName",
        scopedSlots: { customRender: "WorkshopName" },
        align: "center",
        width: "100px",
    },
    {
        title: "生产产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "LineName" },
        align: "center",
        width: "100px",
    },
    {
        title: "接收数量",
        dataIndex: "ReportQty",
        scopedSlots: { customRender: "ReportQty" },
        align: "center",
        width: "100px",
    },
    {
        title: "生产数量",
        dataIndex: "RequirementQty",
        scopedSlots: { customRender: "RequirementQty" },
        align: "center",
        width: "100px",
    },
    {
        title: "报废数量",
        dataIndex: "ScrapedQty",
        scopedSlots: { customRender: "ScrapedQty" },
        align: "center",
        width: "100px",
    },
    {
        title: "开始时间",
        dataIndex: "DatetimeStart",
        scopedSlots: { customRender: "DatetimeStart" },
        align: "center",
        width: "100px",
    },
    {
        title: "完成时间",
        dataIndex: "RequirementQty",
        scopedSlots: { customRender: "RequirementQty" },
        align: "center",
        width: "100px",
    },
    {
        title: "报工人",
        dataIndex: "UserCode",
        scopedSlots: { customRender: "UserCode" },
        align: "center",
        width: "100px",
    },
    {
        title: "接收人",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
        width: "100px",
    },
    {
        title: "备注",
        dataIndex: "Remarks",
        scopedSlots: { customRender: "Remarks" },
        align: "center",
        width: 100,
    },
];