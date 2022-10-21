/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-10-20 09:29:57
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/client/data/archives.js
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
        title: "客户编码",
        dataIndex: "ClientCode",
        scopedSlots: { customRender: "ClientCode" },
        align: "center",
    },
    {
        title: "客户名称",
        dataIndex: "ClientFullName",
        scopedSlots: { customRender: "ClientFullName" },
        align: "center",
    },
    {
        title: "客户简称",
        dataIndex: "ClientName",
        scopedSlots: { customRender: "ClientName" },
        align: "center",
        width: 300,
    },
    {
        title: "邀约状态",
        dataIndex: "InviteStatus",
        scopedSlots: { customRender: "InviteStatus" },
        align: "center",
    },
    {
        title: "客户状态",
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