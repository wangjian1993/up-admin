/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-11-11 09:38:19
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/receiving/data/list.js
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
        title: "送货类型",
        dataIndex: "DeliveryType",
        scopedSlots: { customRender: "DeliveryType" },
        align: "center",
    },
    {
        title: "送货状态",
        dataIndex: "DeliveryStatus",
        scopedSlots: { customRender: "DeliveryStatus" },
        align: "center",
    },
    {
        title: "采购人",
        dataIndex: "PurchaseUser",
        scopedSlots: { customRender: "PurchaseUser" },
        align: "center",
    },
    {
        title: "制单人",
        dataIndex: "PublishUser",
        scopedSlots: { customRender: "PublishUser" },
        align: "center",
    },
    {
        title: "项次",
        dataIndex: "PurchaseSort",
        scopedSlots: { customRender: "PurchaseSort" },
        align: "center",
    },
    {
        title: "物料编码",
        dataIndex: "ItemCode",
        scopedSlots: { customRender: "ItemCode" },
        align: "center",
    },
    {
        title: "物料名称",
        dataIndex: "ItemName",
        scopedSlots: { customRender: "ItemName" },
        align: "center",
    },
    {
        title: "物料规格",
        dataIndex: "ItemSpecification",
        scopedSlots: { customRender: "ItemSpecification" },
        align: "center",
    },
];