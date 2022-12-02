/*
 * @Author: max
 * @Date: 2021-11-29 13:58:17
 * @LastEditTime: 2022-12-02 15:42:02
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
        title: "工单号",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
        width: 120
    },
    {
        title: "追溯码",
        dataIndex: "QrCode",
        scopedSlots: { customRender: "QrCode" },
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
        title: "完工时间",
        dataIndex: "DatetimeStarted",
        scopedSlots: { customRender: "DatetimeStarted" },
        align: "center",
        width: 120
    },
    {
        title: "打印时间",
        dataIndex: "DateTimePrint",
        scopedSlots: { customRender: "DateTimePrint" },
        align: "center",
        width: 120
    },
    {
        title: "打印人",
        dataIndex: "UserReprint",
        scopedSlots: { customRender: "UserReprint" },
        align: "center",
        width: 120
    },
    {
        title: "打印次数",
        dataIndex: "PrintCount",
        scopedSlots: { customRender: "PrintCount" },
        align: "center",
        width: 120
    }
];

export const columns3 = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "追溯码",
        dataIndex: "QrCode",
        scopedSlots: { customRender: "QrCode" },
        align: "center",
        width: 120
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width: 120
    },
    {
        title: "投料料号",
        dataIndex: "MitemCode",
        scopedSlots: { customRender: "MitemCode" },
        align: "center",
        width: 120
    },
    {
        title: "投料料名",
        dataIndex: "MitemName",
        scopedSlots: { customRender: "MitemName" },
        align: "center",
        width: 250
    },
    {
        title: "投料数量",
        dataIndex: "ReleasedQty",
        scopedSlots: { customRender: "ReleasedQty" },
        align: "center",
        width: 80
    },
    {
        title: "采购单号",
        dataIndex: "PurchaseNo",
        scopedSlots: { customRender: "PurchaseNo" },
        align: "center",
        width: 100
    },
    {
        title: "投料工序",
        dataIndex: "ProcessName",
        scopedSlots: { customRender: "ProcessName" },
        align: "center",
        width: 100
    },
    {
        title: "投料时间",
        dataIndex: "DateTimeReleased",
        scopedSlots: { customRender: "DateTimeReleased" },
        align: "center",
        width: 120
    },
    {
        title: "投料人",
        dataIndex: "UserReleased",
        scopedSlots: { customRender: "UserReleased" },
        align: "center",
        width: 120
    },
    {
        title: "操作",
        scopedSlots: { customRender: "Action" },
        align: "center",
        width: 120
    }
];