/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-09-05 15:26:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/data/notification.js
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
        dataIndex: "Title",
        scopedSlots: { customRender: "Title" },
        align: "center",
    },
    {
        title: "重要度",
        dataIndex: "Priority",
        scopedSlots: { customRender: "Priority" },
        align: "center",
    },
    {
        title: "发送日期",
        dataIndex: "SendTime",
        scopedSlots: { customRender: "SendTime" },
        align: "center",
    },
    {
        title: "发件人",
        dataIndex: "SendUser",
        scopedSlots: { customRender: "SendUser" },
        align: "center",
    },
    {
        title: "附件",
        dataIndex: "Sort",
        scopedSlots: { customRender: "Sort" },
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