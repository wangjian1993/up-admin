/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-09-27 13:55:54
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/data/authentication.js
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
        title: "供应商编码",
        dataIndex: "SupplierCode",
        scopedSlots: { customRender: "SupplierCode" },
        align: "center",
    },
    {
        title: "供应商名称",
        dataIndex: "SupplierFullName",
        scopedSlots: { customRender: "SupplierFullName" },
        align: "center",
    },
    {
        title: "标题",
        dataIndex: "Title",
        scopedSlots: { customRender: "Title" },
        align: "center",
    },
    {
        title: "资质文件编码",
        dataIndex: "Code",
        scopedSlots: { customRender: "Code" },
        align: "center",
    },
    {
        title: "资质分类",
        dataIndex: "Name",
        scopedSlots: { customRender: "Name" },
        align: "center",
    },
    {
        title: "是否必要",
        dataIndex: "IsRequired",
        scopedSlots: { customRender: "IsRequired" },
        align: "center",
    },
    {
        title: "有效期",
        dataIndex: "Expired",
        scopedSlots: { customRender: "Expired" },
        align: "center",
    },
    {
        title: "到期日期",
        dataIndex: "ExpiredLength",
        scopedSlots: { customRender: "ExpiredLength" },
        align: "center",
    },
    {
        title: "附件",
        dataIndex: "FileName",
        scopedSlots: { customRender: "FileName" },
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