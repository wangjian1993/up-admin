/*
 * @Author: max
 * @Date: 2021-11-29 13:58:17
 * @LastEditTime: 2021-12-31 14:47:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/components/data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "生产日计划批号",
        dataIndex: "BatchNo",
        scopedSlots: { customRender: "BatchNo" },
        align: "center",
        width: 120
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
        width: 100,
    },
    {
        title: "生产车间",
        dataIndex: "WorkshopName",
        scopedSlots: { customRender: "WorkshopName" },
        align: "center",
        width: 100
    },
    {
        title: "产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "LineName" },
        align: "center",
        width: 80
    },
    {
        title: "工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 120
    },
    {
        title: "业务订单号",
        dataIndex: "SalesOrderNo",
        scopedSlots: { customRender: "SalesOrderNo" },
        align: "center",
        width: 100
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width: 120
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width: 250
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
        dataIndex: "ReportQty",
        scopedSlots: { customRender: "ReportQty" },
        slots: { title: "ReportQtyTitle" },
        align: "center",
        width: 120
    },
    {
        title: "计划数量",
        dataIndex: "PlanQty",
        scopedSlots: { customRender: "PlanQty" },
        align: "center",
        width: 120
    },
    {
        title: "开工时间",
        dataIndex: "DatetimeStart",
        scopedSlots: { customRender: "DatetimeStart" },
        align: "center",
        width: 130,
    },
    {
        title: "填单人",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
        width: 120
    },
    {
        title: "填单时间",
        dataIndex: "DateCreated",
        scopedSlots: { customRender: "DateCreated" },
        align: "center",
        width: 120
    },
    {
        title: "状态",
        dataIndex: "ProcessStatusName",
        scopedSlots: { customRender: "ProcessStatusName" },
        align: "center",
        width: 120
    },
];
export const columns1 = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "生产日计划批号",
        dataIndex: "BatchNo",
        scopedSlots: { customRender: "BatchNo" },
        align: "center",
        width: 120
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
        width: 100,
    },
    {
        title: "生产车间",
        dataIndex: "WorkshopName",
        scopedSlots: { customRender: "WorkshopName" },
        align: "center",
        width: 100
    },
    {
        title: "产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "LineName" },
        align: "center",
        width: 80
    },
    {
        title: "工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 120
    },
    {
        title: "业务订单号",
        dataIndex: "SalesOrderNo",
        scopedSlots: { customRender: "SalesOrderNo" },
        align: "center",
        width: 100
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width: 120
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width: 250
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
        dataIndex: "ReportQty",
        scopedSlots: { customRender: "ReportQty" },
        slots: { title: "ReportQtyTitle" },
        align: "center",
        width: 120
    },
    {
        title: "报废数量",
        dataIndex: "ScrapedQty",
        scopedSlots: { customRender: "ScrapedQty" },
        align: "center",
        width: 120
    },
    {
        title: "计划数量",
        dataIndex: "PlanQty",
        scopedSlots: { customRender: "PlanQty" },
        align: "center",
        width: 120
    },
    {
        title: "开工时间",
        dataIndex: "DatetimeStart",
        scopedSlots: { customRender: "DatetimeStart" },
        align: "center",
        width: 130,
    },
    {
        title: "填单人",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
        width: 120
    },
    {
        title: "填单时间",
        dataIndex: "DateCreated",
        scopedSlots: { customRender: "DateCreated" },
        align: "center",
        width: 120
    },
    {
        title: "状态",
        dataIndex: "ProcessStatusName",
        scopedSlots: { customRender: "ProcessStatusName" },
        align: "center",
        width: 120
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        fixed: "right",
        width: 100,
    }
];