/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-08-11 18:08:31
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/receiving/data/delivery.js
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
        title: "送货通知单",
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
        title: "收货仓库",
        dataIndex: "ReceiptWarehouse",
        scopedSlots: { customRender: "ReceiptWarehouse" },
        align: "center",
    },
    {
        title: "预计到厂",
        dataIndex: "PlanDatetime",
        scopedSlots: { customRender: "PlanDatetime" },
        align: "center",
    },
    {
        title: "送货类型",
        dataIndex: "DeliveryType",
        scopedSlots: { customRender: "DeliveryType" },
        align: "center",
    },
    {
        title: "送货方式",
        dataIndex: "DeliveryMethod",
        scopedSlots: { customRender: "DeliveryMethod" },
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