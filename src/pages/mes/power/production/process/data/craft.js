/*
 * @Author: max
 * @Date: 2021-11-30 14:42:25
 * @LastEditTime: 2022-10-14 11:21:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/process/data/craft.js
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
        title: "工艺路线编码",
        dataIndex: "RoutingCode",
        scopedSlots: { customRender: "RoutingCode" },
        align: "center",
    },
    {
        title: "工艺路线名称",
        dataIndex: "RoutingName",
        scopedSlots: { customRender: "RoutingName" },
        align: "center",
    },
    {
        title: "工序路线",
        dataIndex: "ProcessNames",
        scopedSlots: { customRender: "ProcessNames" },
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "Enable",
        scopedSlots: { customRender: "Enable" },
        align: "center",
    },
    {
        title: "创建时间",
        dataIndex: "CreateDateTime",
        scopedSlots: { customRender: "CreateDateTime" },
        align: "center",
        width:200,
        customRender: (text) => {
            let str  = text.split("T")
            return str[0] + " " + str[1];
        }
    },
    {
        title: "创建人",
        dataIndex: "CreateUser",
        scopedSlots: { customRender: "CreateUser" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
    },
];