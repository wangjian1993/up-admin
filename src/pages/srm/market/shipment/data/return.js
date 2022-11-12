/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-11-11 11:01:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/data/return.js
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
        title: "客户",
        dataIndex: "PurchaseEnterprise",
        scopedSlots: { customRender: "PurchaseEnterprise" },
        align: "center",
    },
    {
        title: "退货单号",
        dataIndex: "DocNo",
        scopedSlots: { customRender: "DocNo" },
        align: "center",
    },
    {
        title: "退货日期",
        dataIndex: "DocDate",
        scopedSlots: { customRender: "DocDate" },
        align: "center",
    },
    {
        title: "是否换货",
        dataIndex: "IsReplace",
        scopedSlots: { customRender: "IsReplace" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "ChangeDatetime",
        scopedSlots: { customRender: "ChangeDatetime" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];