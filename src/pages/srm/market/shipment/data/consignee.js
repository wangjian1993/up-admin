/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-08-12 09:06:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/receiving/data/CONSIGNEE.js
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
        title: "送货通知单号",
        dataIndex: "DocNo",
        scopedSlots: { customRender: "DocNo" },
        align: "center",
    },
    {
        title: "收货单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "收货日期",
        dataIndex: "DocDate",
        scopedSlots: { customRender: "DocDate" },
        align: "center",
    },
    {
        title: "收货状态",
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