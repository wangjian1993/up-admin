
import { splitData } from "@/utils/util.js";
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width:50,
    },
    {
        title: "品号",
        dataIndex: "ITEM_CODE",
        scopedSlots: { customRender: "ITEM_CODE" },
        align: "center",
        width: 150,
    },
    {
        title: "品名",
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "center",
        width: 150,
    },
    {
        title: "规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "center",
        width: 300,
    },
    {
        title: "储运编号",
        dataIndex: "PLANT_CODE",
        scopedSlots: { customRender: "PLANT_CODE" },
        align: "center",
        width: 100,
    },
    {
        title: "储运名称",
        dataIndex: "PLANT_NAME",
        scopedSlots: { customRender: "PLANT_NAME" },
        align: "center",
        width: 100,
    },
    {
        title: "工单号",
        dataIndex: "doc_no_mo",
        scopedSlots: { customRender: "doc_no_mo" },
        align: "center",
        width: 100,
    },
    {
        title: "交易日期",
        dataIndex: "TRANSACTION_DATE",
        scopedSlots: { customRender: "TRANSACTION_DATE" },
        align: "center",
        width: 100,
        customRender: (text) => {
            return splitData(text);
        }
    },
    {
        title: "交易时间",
        dataIndex: "TRANSACTION_TIME",
        scopedSlots: { customRender: "TRANSACTION_TIME" },
        align: "center",
        width: 80,
    },
    {
        title: "来源单号",
        dataIndex: "DOC_NO",
        scopedSlots: { customRender: "DOC_NO" },
        align: "center",
        width: 100,
    },
    {
        title: "成本码",
        dataIndex: "COST_CODE",
        scopedSlots: { customRender: "COST_CODE" },
        align: "center",
        width: 60,
    },
    {
        title: "单位成本",
        dataIndex: "UNIT_COST",
        scopedSlots: { customRender: "UNIT_COST" },
        align: "center",
        width: 80,
    },
    {
        title: "库存数量",
        dataIndex: "INVENTORY_QTY",
        scopedSlots: { customRender: "INVENTORY_QTY" },
        align: "center",
        width: 80,
    },
    {
        title: "库存成本",
        dataIndex: "AMOUNT_COST",
        scopedSlots: { customRender: "AMOUNT_COST" },
        align: "center",
        width: 120,
    },
    {
        title: "第二数量",
        dataIndex: "SECOND_QTY",
        scopedSlots: { customRender: "SECOND_QTY" },
        align: "center",
        width: 80,
    },
    {
        title: "影响库存",
        dataIndex: "STOCK_ACTION",
        scopedSlots: { customRender: "STOCK_ACTION" },
        align: "center",
        width: 80,
    },
    {
        title: "会计年度",
        dataIndex: "ACCOUNT_YEAR",
        scopedSlots: { customRender: "ACCOUNT_YEAR" },
        align: "center",
        width: 100,
    },
    {
        title: "会计期间序号",
        dataIndex: "ACCOUNT_PERIOD_SEQNO",
        scopedSlots: { customRender: "ACCOUNT_PERIOD_SEQNO" },
        align: "center",
        width: 90,
    },
    {
        title: "交易币种",
        dataIndex: "TRANSACTION_CATEGORY",
        scopedSlots: { customRender: "TRANSACTION_CATEGORY" },
        align: "center",
        width: 80,
    },
    {
        title: "会计分类名称",
        dataIndex: "IM_FICATEGORY_NAME",
        scopedSlots: { customRender: "IM_FICATEGORY_NAME" },
        align: "center",
        width: 100,
    },
    {
        title: "成本分类名称",
        dataIndex: "IM_COST_CATEGORY_NAME",
        scopedSlots: { customRender: "IM_COST_CATEGORY_NAME" },
        align: "center",
        width: 100,
    },
    {
        title: "来源单据",
        dataIndex: "DOC_NAME",
        scopedSlots: { customRender: "DOC_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "仓库编号",
        dataIndex: "WAREHOUSE_CODE",
        scopedSlots: { customRender: "WAREHOUSE_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "仓库名称",
        dataIndex: "WAREHOUSE_NAME",
        scopedSlots: { customRender: "WAREHOUSE_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "库位编号",
        dataIndex: "BIN_CODE",
        scopedSlots: { customRender: "BIN_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "批号",
        dataIndex: "LOT_CODE",
        scopedSlots: { customRender: "LOT_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "批号说明",
        dataIndex: "LOT_DESCRIPTION",
        scopedSlots: { customRender: "LOT_DESCRIPTION" },
        align: "center",
        width: 80,
    },
];