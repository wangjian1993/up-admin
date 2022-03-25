/*
 * @Author: max
 * @Date: 2021-11-29 13:58:17
 * @LastEditTime: 2022-03-25 17:31:59
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/data.js
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
        title: "扫描条码",
        dataIndex: "ScanCode",
        scopedSlots: { customRender: "ScanCode" },
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
        dataIndex: "WorkOrderNo",
        scopedSlots: { customRender: "WorkOrderNo" },
        align: "center",
        width: 80
    },
    {
        title: "业务订单号",
        dataIndex: "WorkOrderNo1",
        scopedSlots: { customRender: "WorkOrderNo1" },
        align: "center",
        width: 100
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width: 150
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width: 120
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
        title: "订单数量",
        dataIndex: "ReportQty",
        scopedSlots: { customRender: "ReportQty" },
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
        dataIndex: "PlanDate1",
        scopedSlots: { customRender: "PlanDate1" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return splitData(text);
        }
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
        dataIndex: "Status",
        scopedSlots: { customRender: "Status" },
        align: "center",
        width: 120
    },
];
