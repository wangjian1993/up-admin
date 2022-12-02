/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-10-20 08:59:06
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/client/data/authentication.js
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
        dataIndex: "SupplierFullName",
        scopedSlots: { customRender: "SupplierFullName" },
        align: "center",
    },
    {
        title: "标题",
        dataIndex: "Name",
        scopedSlots: { customRender: "Name" },
        align: "center",
    },
    {
        title: "有效期",
        dataIndex: "ExpiredLength",
        scopedSlots: { customRender: "ExpiredLength" },
        align: "center",
    },
    {
        title: "到期日期",
        dataIndex: "Expired",
        scopedSlots: { customRender: "Expired" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "Status",
        scopedSlots: { customRender: "Status" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];