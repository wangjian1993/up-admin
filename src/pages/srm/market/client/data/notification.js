/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-08-26 09:32:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/client/data/notification.js
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
        title: "标题",
        dataIndex: "SupplierCode",
        scopedSlots: { customRender: "SupplierCode" },
        align: "center",
    },
    {
        title: "重要度",
        dataIndex: "SupplierFullName",
        scopedSlots: { customRender: "SupplierFullName" },
        align: "center",
    },
    {
        title: "发送日期",
        dataIndex: "Title",
        scopedSlots: { customRender: "Title" },
        align: "center",
    },
    {
        title: "发件企业编码",
        dataIndex: "ExpiredLength",
        scopedSlots: { customRender: "ExpiredLength" },
        align: "center",
    },
    {
        title: "发件企业名称",
        dataIndex: "Expired",
        scopedSlots: { customRender: "Expired" },
        align: "center",
    },
    {
        title: "附件",
        dataIndex: "Status",
        scopedSlots: { customRender: "Status" },
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