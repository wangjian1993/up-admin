/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-09-06 10:56:44
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
        dataIndex: "Name",
        scopedSlots: { customRender: "Name" },
        align: "center",
    },
    {
        title: "供应商名称",
        dataIndex: "Department",
        scopedSlots: { customRender: "Department" },
        align: "center",
    },
    {
        title: "标题",
        dataIndex: "fax",
        scopedSlots: { customRender: "fax" },
        align: "center",
    },
    {
        title: "资质文件编码",
        dataIndex: "MobilePhone",
        scopedSlots: { customRender: "MobilePhone" },
        align: "center",
    },
    {
        title: "资质分类",
        dataIndex: "Phone",
        scopedSlots: { customRender: "Phone" },
        align: "center",
    },
    {
        title: "是否必要",
        dataIndex: "Email",
        scopedSlots: { customRender: "Email" },
        align: "center",
    },
    {
        title: "有效期",
        dataIndex: "Wechat",
        scopedSlots: { customRender: "Wechat" },
        align: "center",
    },
    {
        title: "资质类型",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
    {
        title: "到期日",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
    {
        title: "状态",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];