/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-09-02 16:01:21
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/data/archives.js
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
        title: "供应商简称",
        dataIndex: "SupplierName",
        scopedSlots: { customRender: "SupplierName" },
        align: "center",
    },
    {
        title: "绑定企业",
        dataIndex: "InviteCompanyId",
        scopedSlots: { customRender: "InviteCompanyId" },
        align: "center",
    },
    {
        title: "ERP分类",
        dataIndex: "ErpType",
        scopedSlots: { customRender: "ErpType" },
        align: "center",
    },
    {
        title: "加入日期",
        dataIndex: "ReceiveTime",
        scopedSlots: { customRender: "ReceiveTime" },
        align: "center",
    },
    {
        title: "邀约人",
        dataIndex: "InviteUser",
        scopedSlots: { customRender: "InviteUser" },
        align: "center",
    },
    {
        title: "邀约状态",
        dataIndex: "InviteStatus",
        scopedSlots: { customRender: "InviteStatus" },
        align: "center",
    },
    {
        title: "供应商状态",
        dataIndex: "Status",
        scopedSlots: { customRender: "Status" },
        align: "center",
    },
    {
        title: "公章上传",
        dataIndex: "",
        scopedSlots: { customRender: "" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];