/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-08-19 14:13:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/templateDesign/data/list.js
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
        title: "模板编码",
        dataIndex: "TemplateCode",
        scopedSlots: { customRender: "TemplateCode" },
        align: "center",
    },
    {
        title: "模板名称",
        dataIndex: "TemplateName",
        scopedSlots: { customRender: "TemplateName" },
        align: "center",
    },
    {
        title: "模板类型",
        dataIndex: "TemplateType",
        scopedSlots: { customRender: "TemplateType" },
        align: "center",
    },
    {
        title: "模板说明",
        dataIndex: "TemplateDesc",
        scopedSlots: { customRender: "TemplateDesc" },
        align: "center",
    },
    {
        title: "机构类型",
        dataIndex: "CompanyType",
        scopedSlots: { customRender: "CompanyType" },
        align: "center",
    },
    {
        title: "机构名称",
        dataIndex: "CompanyName",
        scopedSlots: { customRender: "CompanyName" },
        align: "center",
    },
    {
        title: "添加人",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
    },
    {
        title: "日期",
        dataIndex: "UpdateTime",
        scopedSlots: { customRender: "UpdateTime" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];