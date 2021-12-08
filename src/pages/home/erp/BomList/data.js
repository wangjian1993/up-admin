/*
 * @Author: max
 * @Date: 2021-11-18 08:51:24
 * @LastEditTime: 2021-12-08 14:42:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomList/data.js
 */
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
        align: "center",
        width: 90,
    },
    {
        title: "快捷码",
        dataIndex: "SHORTCUT",
        scopedSlots: { customRender: "SHORTCUT" },
        align: "center",
        width: 60,
    },
    {
        title: "品名",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "center",
        width: 200,
    },
    {
        title: "图号",
        dataIndex: "DRAWING_NO",
        scopedSlots: { customRender: "DRAWING_NO" },
        align: "center",
        width: 80,
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
        width: 50,
    },
    {
        title: "BOM生效状态",
        dataIndex: "ApproveStatus",
        scopedSlots: { customRender: "ApproveStatus" },
        align: "center",
        width: 80,
    },
    {
        title: "工厂",
        dataIndex: "PLANT_CODE_P",
        scopedSlots: { customRender: "PLANT_CODE_P" },
        align: "center",
        width: 60,
    },
    {
        title: "工厂名称",
        dataIndex: "PLANT_NAME_P",
        scopedSlots: { customRender: "PLANT_NAME_P" },
        align: "center",
        width: 60,
    },
    {
        title: "引用工厂",
        dataIndex: "PLANT_CODE_R",
        scopedSlots: { customRender: "PLANT_CODE_R" },
        align: "center",
        width: 60,
    },
    {
        title: "引用工厂名称",
        dataIndex: "PLANT_NAME_R",
        scopedSlots: { customRender: "PLANT_NAME_R" },
        align: "center",
        width: 60,
    },
    {
        title: "版次",
        dataIndex: "VERSION_TIMES",
        scopedSlots: { customRender: "VERSION_TIMES" },
        align: "center",
        width: 60,
    },
    {
        title: "生效日期",
        dataIndex: "ApproveDate",
        scopedSlots: { customRender: "ApproveDate" },
        align: "center",
        width: 60,
    },
    {
        title: "生效审核人员",
        dataIndex: "EMPLOYEE_NAME_A",
        scopedSlots: { customRender: "EMPLOYEE_NAME_A" },
        align: "center",
        width: 60,
    },
    {
        title: "创建日期",
        dataIndex: "CreateDate",
        scopedSlots: { customRender: "CreateDate" },
        align: "center",
        width: 60,
    },
    {
        title: "创建人员",
        dataIndex: "EMPLOYEE_NAME_C",
        scopedSlots: { customRender: "EMPLOYEE_NAME_C" },
        align: "center",
        width: 60,
    },
    {
        title: "最后修改日期",
        dataIndex: "LastModifiedDate",
        scopedSlots: { customRender: "LastModifiedDate" },
        align: "center",
        width: 60,
    },
    {
        title: "最后修改人员",
        dataIndex: "EMPLOYEE_NAME_L",
        scopedSlots: { customRender: "EMPLOYEE_NAME_L" },
        align: "center",
        width: 60,
    },
    {
        title: "备注",
        dataIndex: "REMARK",
        scopedSlots: { customRender: "REMARK" },
        align: "center",
        width: 40,
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        fixed: "right",
        width: 80,
    },
];