/*
 * @Author: max
 * @Date: 2021-11-18 08:53:46
 * @LastEditTime: 2021-12-21 14:17:30
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomUnfold/data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width:50,
    },
    {
        title: "主件品号",
        dataIndex: "ITEM_CODE",
        scopedSlots: { customRender: "ITEM_CODE" },
        align: "left",
        width: 150,
    },
    {
        title: "主件品号",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "left",
        width: 150,
    },
    {
        title: "主件规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "left",
        width: 200,
    },
    {
        title: "主件图号",
        dataIndex: "DRAWING_NO",
        scopedSlots: { customRender: "DRAWING_NO" },
        align: "left",
        width: 100,
    },
    {
        title: "单位",
        dataIndex: "UNIT_NAME",
        scopedSlots: { customRender: "UNIT_NAME" },
        align: "center",
        width: 50,
    },
    {
        title: "品号类型",
        dataIndex: "ITEM_PROPERTY",
        scopedSlots: { customRender: "ITEM_PROPERTY" },
        align: "center",
        width: 80,
    },
    {
        title: "BOM生效状态",
        dataIndex: "ApproveStatus",
        scopedSlots: { customRender: "ApproveStatus" },
        align: "center",
        width: 120,
    },
    {
        title: "工厂",
        dataIndex: "PLANT_NAME_P",
        scopedSlots: { customRender: "PLANT_NAME_P" },
        align: "center",
        width: 40,
    },
    {
        title: "引用工厂",
        dataIndex: "PLANT_CODE_R",
        scopedSlots: { customRender: "PLANT_CODE_R" },
        align: "center",
        width: 80,
    },
    {
        title: "引用工厂名称",
        dataIndex: "PLANT_NAME_R",
        scopedSlots: { customRender: "PLANT_NAME_R" },
        align: "center",
        width: 120,
    },
    {
        title: "版次",
        dataIndex: "VERSION_TIMES",
        scopedSlots: { customRender: "VERSION_TIMES" },
        align: "center",
        width: 40,
    },
    {
        title: "生效日期",
        dataIndex: "ApproveDate",
        scopedSlots: { customRender: "ApproveDate" },
        align: "center",
        width: 80,
    },
    {
        title: "生效审核人员",
        dataIndex: "EMPLOYEE_NAME_A",
        scopedSlots: { customRender: "EMPLOYEE_NAME_A" },
        align: "center",
        width: 100,
    },
    {
        title: "创建日期",
        dataIndex: "CreateDate",
        scopedSlots: { customRender: "CreateDate" },
        align: "center",
        width: 80,
    },
    {
        title: "创建人员",
        dataIndex: "EMPLOYEE_NAME_C",
        scopedSlots: { customRender: "EMPLOYEE_NAME_C" },
        align: "center",
        width: 80,
    },
    {
        title: "最后修改日期",
        dataIndex: "LastModifiedDate",
        scopedSlots: { customRender: "LastModifiedDate" },
        align: "center",
        width: 100,
    },
    {
        title: "最后修改人员",
        dataIndex: "EMPLOYEE_NAME_L",
        scopedSlots: { customRender: "EMPLOYEE_NAME_L" },
        align: "center",
        width: 100,
    },
    {
        title: "快捷码",
        dataIndex: "SHORTCUT",
        scopedSlots: { customRender: "SHORTCUT" },
        align: "center",
        width: 80,
    },
];
export const innerColumns = [
    {
        title: "阶层",
        dataIndex: "LOWLEVEL",
        scopedSlots: { customRender: "LOWLEVEL" },
        align: "left",
        width: 80,
    },
    {
        title: "序号",
        dataIndex: "INDEX",
        scopedSlots: { customRender: "INDEX" },
        align: "center",
        width: 50,
    },
    {
        title: "上阶品号",
        dataIndex: "LAST_ITEM_CODE",
        scopedSlots: { customRender: "LAST_ITEM_CODE" },
        align: "left",
        width: 120,
    },
    {
        title: "元件品号",
        dataIndex: "ITEM_CODE",
        scopedSlots: { customRender: "ITEM_CODE" },
        align: "left",
        width: 80,
    },
    {
        title: "元件品名",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "left",
        width: 150,
    },
    {
        title: "元件规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "left",
        width: 200,
    },
    {
        title: "单位",
        dataIndex: "UNIT_NAME",
        scopedSlots: { customRender: "UNIT_NAME" },
        align: "center",
        width: 50,
    },
    {
        title: "组成用量",
        dataIndex: "QTY_PER",
        scopedSlots: { customRender: "QTY_PER" },
        align: "center",
        width: 80,
    },
    {
        title: "底数",
        dataIndex: "DENOMINATOR",
        scopedSlots: { customRender: "DENOMINATOR" },
        align: "center",
        width: 50,
    },
    {
        title: "插件位置",
        dataIndex: "COMPONENT_LOCATION",
        scopedSlots: { customRender: "COMPONENT_LOCATION" },
        align: "center",
        width: 80,
    },
    {
        title: "变动损耗",
        dataIndex: "DYNAMIC_LOSS_RATE",
        scopedSlots: { customRender: "DYNAMIC_LOSS_RATE" },
        align: "center",
        width: 80,
    },
    {
        title: "生效日期",
        dataIndex: "EFFECTIVE_DATE",
        scopedSlots: { customRender: "EFFECTIVE_DATE" },
        align: "center",
        width: 80,
        customRender: (text) => {
            return splitData(text);
        },
    },
    {
        title: "失效时间",
        dataIndex: "EXPRITY_DATE",
        scopedSlots: { customRender: "EXPRITY_DATE" },
        align: "center",
        width: 80,
        customRender: (text) => {
            return splitData(text);
        },
    },
    {
        title: "备注",
        dataIndex: "REMARK",
        scopedSlots: { customRender: "REMARK" },
        align: "center",
        width: 80,
    },
    {
        title: "BOM生效状态",
        dataIndex: "ApproveStatus",
        scopedSlots: { customRender: "ApproveStatus" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return text == "Y" ? "已生效" : text == "N" ? "未生效" : "失效";
        },
    },
    {
        title: "图号",
        dataIndex: "DRAWING_NO",
        scopedSlots: { customRender: "DRAWING_NO" },
        align: "center",
        width: 80,
    },
    {
        title: "品号类型",
        dataIndex: "ITEM_PROPERTY",
        scopedSlots: { customRender: "ITEM_PROPERTY" },
        align: "center",
        width: 80
    },
    {
        title: "BOM生效日期",
        dataIndex: "ApproveDate",
        scopedSlots: { customRender: "ApproveDate" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return splitData(text);
        },
    },
    {
        title: "BOM生效者",
        dataIndex: "EMPLOYEE_NAME_A",
        scopedSlots: { customRender: "EMPLOYEE_NAME_A" },
        align: "center",
        width: 120,
    },
    {
        title: "BOM创建日期",
        dataIndex: "CreateDate",
        scopedSlots: { customRender: "CreateDate" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return splitData(text);
        },
    },
    {
        title: "快捷码",
        dataIndex: "SHORTCUT",
        scopedSlots: { customRender: "SHORTCUT" },
        align: "left",
        width: 180,
    },
];