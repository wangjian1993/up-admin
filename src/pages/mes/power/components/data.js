/*
 * @Author: max
 * @Date: 2021-11-29 13:58:17
 * @LastEditTime: 2022-10-28 10:56:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/components/data.js
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
        title: "生产工厂/车间/产线",
        dataIndex: "Plant",
        scopedSlots: { customRender: "Plant" },
        align: "center",
        width: 100,
    },
    {
        title: "扫描条码",
        dataIndex: "ScanCode",
        scopedSlots: { customRender: "ScanCode" },
        align: "center",
        width: 120
    },
    {
        title: "工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 120
    },
    {
        title: "订单号",
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
        width: 200
    },
    {
        title: "进站时间",
        dataIndex: "DatetimeFinished",
        scopedSlots: { customRender: "DatetimeFinished" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return splitData(text);
        }
    },
    {
        title: "工单数量",
        dataIndex: "MoQty",
        scopedSlots: { customRender: "MoQty" },
        align: "center",
        width: 80
    },
    {
        title: "进站数量",
        dataIndex: "ReportQty",
        scopedSlots: { customRender: "ReportQty" },
        align: "center",
        width: 80,
    },
    {
        title: "备注",
        dataIndex: "ProcessStatusName",
        scopedSlots: { customRender: "ProcessStatusName" },
        align: "center",
        width: 80
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
        title: "扫描条码",
        dataIndex: "ScanCode",
        scopedSlots: { customRender: "ScanCode" },
        align: "center",
        width: 120
    },
    {
        title: "工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 120
    },
    {
        title: "订单号",
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
        width: 200
    },
    {
        title: "报工时间",
        dataIndex: "DatetimeFinished",
        scopedSlots: { customRender: "DatetimeFinished" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return splitData(text);
        }
    },
    {
        title: "工单数量",
        dataIndex: "MoQty",
        scopedSlots: { customRender: "MoQty" },
        align: "center",
        width: 80
    },
    {
        title: "完工数量",
        dataIndex: "ReportQty",
        scopedSlots: { customRender: "ReportQty" },
        align: "center",
        width: 80,
    },
    {
        title: "不良数量",
        dataIndex: "ScrapedQty",
        scopedSlots: { customRender: "ScrapedQty" },
        align: "center",
        width: 80,
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
        title: "生产产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "LineName" },
        align: "center",
        width: 80
    },
    {
        title: "备注",
        dataIndex: "ProcessStatusName",
        scopedSlots: { customRender: "ProcessStatusName" },
        align: "center",
        width: 80
    },
];
export const columns2 = [
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
        title: "返工车间",
        dataIndex: "ReworkWorkshopName",
        scopedSlots: { customRender: "WorkshopName" },
        align: "center",
        width: 100
    },
    {
        title: "返工产线",
        dataIndex: "ReworkLineName",
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
        title: "返工数量",
        dataIndex: "ReworkQty",
        scopedSlots: { customRender: "ReworkQty" },
        align: "center",
        width: 120
    },
    {
        title: "不良数量",
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
        title: "填单人",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
        width: 120
    },
    {
        title: "返工提交时间",
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