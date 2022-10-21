/*
 * @Author: max
 * @Date: 2021-11-30 14:42:25
 * @LastEditTime: 2022-10-19 16:46:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/data/process.js
 */
// import {splitData} from '@/utils/util';
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
    },
    {
        title: "生产工厂",
        dataIndex: "PlantName",
        scopedSlots: { customRender: "PlantName" },
        align: "center",
    },
    {
        title: "工序类型",
        dataIndex: "ProcessTypeCode",
        scopedSlots: { customRender: "ProcessTypeCode" },
        align: "center",
    },
    {
        title: "工序编码",
        dataIndex: "ProcessCode",
        scopedSlots: { customRender: "ProcessCode" },
        align: "center",
    },
    {
        title: "工序名称",
        dataIndex: "ProcessName",
        scopedSlots: { customRender: "ProcessName" },
        align: "center",
    },
    {
        title: "工序步骤",
        dataIndex: "Step",
        scopedSlots: { customRender: "Step" },
        align: "center",
    },
    {
        title: "工序描述",
        dataIndex: "ProcessDesc",
        scopedSlots: { customRender: "ProcessDesc" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "EnableName",
        scopedSlots: { customRender: "EnableName" },
        align: "center",
    },
    {
        title: "是否老化",
        dataIndex: "IsAgeing",
        scopedSlots: { customRender: "IsAgeing" },
        align: "center",
    },
    {
        title: "创建时间",
        dataIndex: "DateTimeCreated",
        scopedSlots: { customRender: "DateTimeCreated" },
        align: "center",
        width:200,
        customRender: (text) => {
            let str  = text.split("T")
            return str[0] + " " + str[1];
        }
    },
    {
        title: "创建人",
        dataIndex: "UserName",
        scopedSlots: { customRender: "UserName" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];