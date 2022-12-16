/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-12-12 09:57:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/financial/data/expense.js
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
        title: "费用单号",
        dataIndex: "OrderNo",
        scopedSlots: { customRender: "OrderNo" },
        align: "center",
    },
    {
        title: "发布人",
        dataIndex: "PublishUser",
        scopedSlots: { customRender: "PublishUser" },
        align: "center",
    },
    {
        title: "发布时间",
        dataIndex: "PublishDatetime",
        scopedSlots: { customRender: "PublishDatetime" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];