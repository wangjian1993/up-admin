/*
 * @Author: max
 * @Date: 2021-11-18 08:49:42
 * @LastEditTime: 2021-12-08 09:46:06
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomInventory/data.js
 */
import { splitData } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "品号",
        dataIndex: "ITEM_CODE",
        scopedSlots: { customRender: "ITEM_CODE" },
        align: "center",
        width: 200,
    },
    {
        title: "快捷码",
        dataIndex: "SHORTCUT",
        scopedSlots: { customRender: "SHORTCUT" },
        align: "center",
        width: 150,
    },
    {
        title: "品名",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "center",
        width: 250,
    },
    {
        title: "规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "center",
        width: 300,
    },
    {
        title: "库存数量",
        dataIndex: "INVENTORY_QTY",
        scopedSlots: { customRender: "INVENTORY_QTY" },
        align: "center",
        width: 150,
    },
    {
        title: "工厂编号",
        dataIndex: "PLANT_CODE",
        scopedSlots: { customRender: "PLANT_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "工厂/储运",
        dataIndex: "PLANT_NAME",
        scopedSlots: { customRender: "PLANT_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "仓库代号",
        dataIndex: "WAREHOUSE_CODE",
        scopedSlots: { customRender: "WAREHOUSE_CODE" },
        align: "center",
        width: 120,
    },
    {
        title: "仓库名称",
        dataIndex: "WAREHOUSE_NAME",
        scopedSlots: { customRender: "WAREHOUSE_NAME" },
        align: "center",
        width: 100,
    },
    {
        title: "仓库单位",
        dataIndex: "UNIT_NAME",
        scopedSlots: { customRender: "UNIT_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "仓库属性",
        dataIndex: "WAREHOUSE_CHARACTER",
        scopedSlots: { customRender: "WAREHOUSE_CHARACTER" },
        align: "center",
        width: 80,
        customRender: (text) => {
            return text == 1 ? "1.普通仓" : text == 2 ? "2.VMI仓" : text == 3 ? "3.寄售客户仓" : text == 4 ? "4.客户寄库仓" : text == 5 ? "5.在途仓" : "6.客供料仓";
        },
    },
    {
        title: "仓库性质",
        dataIndex: "WAREHOUSE_PROPERTY",
        scopedSlots: { customRender: "WAREHOUSE_PROPERTY" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return text == "1" ? "1.存货仓" : "2.非存货仓";
        },
    },
    {
        title: "库位管理",
        dataIndex: "BIN_CONTROL",
        scopedSlots: { customRender: "BIN_CONTROL" },
        align: "center",
        width: 80,
        customRender: (text) => {
            return text == 1 ? "1.启用" : "0.不启用";
        },
    },
    {
        title: "纳入可用量计算",
        dataIndex: "INCLUDED_AVAILABLE_QTY",
        scopedSlots: { customRender: "INCLUDED_AVAILABLE_QTY" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return text ? "Y" : "N";
        },
    },
    {
        title: "库存量不足准许出库",
        dataIndex: "NEGATIVE_INVENTORY_ALLOWED",
        scopedSlots: { customRender: "NEGATIVE_INVENTORY_ALLOWED" },
        align: "center",
        width: 150,
        customRender: (text) => {
            return text ? "Y" : "N";
        },
    },
    {
        title: "首次入库日",
        dataIndex: "ORIGINIAL_RECEIPT_DATE",
        scopedSlots: { customRender: "ORIGINIAL_RECEIPT_DATE" },
        align: "center",
        width: 120,
        customRender: (text) => {
            return splitData(text);
        },
    },
    {
        title: "最后入库日",
        dataIndex: "LAST_RECEIPT_DATE",
        scopedSlots: { customRender: "LAST_RECEIPT_DATE" },
        align: "center",
        width: 100,
        customRender: (text) => {
            return splitData(text);
        },
    },
    {
        title: "最后出库日",
        dataIndex: "LAST_ISSUE_DATE",
        scopedSlots: { customRender: "LAST_ISSUE_DATE" },
        align: "center",
        width: 100,
        customRender: (text) => {
            return splitData(text);
        },
    },
    {
        title: "品号类型",
        dataIndex: "ITEM_PROPERTY",
        scopedSlots: { customRender: "ITEM_PROPERTY" },
        align: "center",
        width: 100,
    },
    {
        title: "批次控制",
        dataIndex: "LOT_CONTROL",
        scopedSlots: { customRender: "LOT_CONTROL" },
        align: "center",
        width: 150,
        customRender: (text) => {
            return text == "N" ? "N.不需求" : text == "T" ? "T.需要且检查库存量" : "Y.需要不检查库存量";
        },
    },
    {
        title: "图号",
        dataIndex: "DRAWING_NO",
        scopedSlots: { customRender: "DRAWING_NO" },
        align: "center",
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        fixed: "right",
        width: 100,
    },
];
export const columnsPrint = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        title: "元件品号",
        dataIndex: "ITEM_CODE",
        scopedSlots: { customRender: "ITEM_CODE" },
        align: "center",
        width: 250,
    },
    {
        title: "品名",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "center",
        width: 250,
    },
    {
        title: "规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "center",
        width: 300,
    },
    {
        title: "单位",
        dataIndex: "UNIT_NAME",
        scopedSlots: { customRender: "UNIT_NAME" },
        align: "center",
        width: 50,
    },
    {
        title: "用量",
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
        title: "备注",
        dataIndex: "REMARK",
        scopedSlots: { customRender: "REMARK" },
        align: "center",
    },
    {
        title: "图号",
        dataIndex: "DRAWING_NO",
        scopedSlots: { customRender: "DRAWING_NO" },
        align: "center",
        width: 200,
    },

    {
        title: "位置",
        dataIndex: "COMPONENT_LOCATION",
        scopedSlots: { customRender: "COMPONENT_LOCATION" },
        align: "center",
        width: 80,
    },
];