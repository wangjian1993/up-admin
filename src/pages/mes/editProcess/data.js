/*
 * @Author: max
 * @Date: 2022-04-08 08:55:56
 * @LastEditTime: 2023-04-27 15:49:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/editProcess/data.js
 */
import { splitDataTime } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
    },
    {
        title: "车间",
        dataIndex: "WorkShopName",
        scopedSlots: { customRender: "WorkShopName" },
        align: "center",
    },
    {
        title: "产线",
        dataIndex: "LineName",
        scopedSlots: { customRender: "LineName" },
        align: "center",
    },
    {
        title: "报工工序",
        dataIndex: "ProcessName",
        scopedSlots: { customRender: "ProcessName" },
        align: "center",
    },
    {
        title: "报工工单",
        dataIndex: "MoCode",
        scopedSlots: { customRender: "MoCode" },
        align: "center",
    },
    {
        title: "扫描的条码",
        dataIndex: "QrCode",
        scopedSlots: { customRender: "QrCode" },
        align: "center",
        width:200
    },
    {
        title: "品号",
        dataIndex: "ProCode",
        scopedSlots: { customRender: "ProCode" },
        align: "center",
        width:120
    },
    {
        title: "品名",
        dataIndex: "ProName",
        scopedSlots: { customRender: "ProName" },
        align: "center",
        width:200
    },
    {
        title: "进站报工数量",
        dataIndex: "ReportQty",
        scopedSlots: { customRender: "ReportQty" },
        align: "center",
    },
    {
        title: "进站报工时间",
        dataIndex: "DatetimeCreated",
        scopedSlots: { customRender: "DatetimeCreated" },
        align: "center",
        customRender: (text) => {
            return splitDataTime(text);
        }
    },
    {
        title: "进站报工用户",
        dataIndex: "UserCreated",
        scopedSlots: { customRender: "UserCreated" },
        align: "center",
    },
    {
        title: "进站修改时间",
        dataIndex: "DatetimeModified",
        scopedSlots: { customRender: "DatetimeModified" },
        align: "center",
        customRender: (text) => {
            return splitDataTime(text);
        }
    },
    {
        title: "报工修改用户",
        dataIndex: "UserModified",
        scopedSlots: { customRender: "UserModified" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        width: 100,
    },
];