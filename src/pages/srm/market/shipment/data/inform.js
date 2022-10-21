/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-10-20 10:07:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/data/inform.js
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
        title: "送货通知单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "送货日期",
        dataIndex: "DeliveryDatetime",
        scopedSlots: { customRender: "DeliveryDatetime" },
        align: "center",
    },
    {
        dataIndex: "ReceiptWarehouse",
        scopedSlots: { customRender: "ReceiptWarehouse" },
        slots: { title: "ReceiptWarehouseTitle" },
        align: "center",
    },
    {
        dataIndex: "DeliveryType",
        scopedSlots: { customRender: "DeliveryType" },
        slots: { title: "DeliveryTypeTitle" },
        align: "center",
    },
    {
        title: "送货状态",
        dataIndex: "DeliveryStatus",
        scopedSlots: { customRender: "DeliveryStatus" },
        align: "center",
    },
    {
        title: "物流状态",
        dataIndex: "ShippingStatus",
        scopedSlots: { customRender: "ShippingStatus" },
        align: "center",
    },
    {
        title: "到货日期",
        dataIndex: "ArrivalDatetime",
        scopedSlots: { customRender: "ArrivalDatetime" },
        align: "center",
    },
    {
        title: "送检状态",
        dataIndex: "InspectionStatus",
        scopedSlots: { customRender: "InspectionStatus" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];