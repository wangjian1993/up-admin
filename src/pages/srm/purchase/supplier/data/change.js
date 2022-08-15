/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-08-11 16:01:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/order/data/change.js
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
        title: "供应商",
        dataIndex: "SupplierFullName",
        scopedSlots: { customRender: "SupplierFullName" },
        align: "center",
    },
    {
        title: "采购单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "变更序号",
        dataIndex: "ChangeNo",
        scopedSlots: { customRender: "ChangeNo" },
        align: "center",
    },
    {
        title: "采购日期",
        dataIndex: "PurchaseDatetime",
        scopedSlots: { customRender: "PurchaseDatetime" },
        align: "center",
    },
    {
        title: "变更日期",
        dataIndex: "ChangeDatetime",
        scopedSlots: { customRender: "ChangeDatetime" },
        align: "center",
    },
    {
        title: "采购员",
        dataIndex: "PurchaseUser",
        scopedSlots: { customRender: "PurchaseUser" },
        align: "center",
    },
    {
        title: "订单金额",
        dataIndex: "OrderAmount",
        scopedSlots: { customRender: "OrderAmount" },
        align: "center",
    },
    {
        title: "变更金额",
        dataIndex: "ChangeMoney",
        scopedSlots: { customRender: "ChangeMoney" },
        align: "center",
    },
    {
        title: "变更状态",
        dataIndex: "ChangeStatus",
        scopedSlots: { customRender: "ChangeStatus" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];