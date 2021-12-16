/*
 * @Author: max
 * @Date: 2021-11-18 08:48:13
 * @LastEditTime: 2021-12-16 11:10:36
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/DeliveryDetail/data.js
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
        title: "供应商编号",
        dataIndex: "SUPPLIER_CODE",
        scopedSlots: { customRender: "SUPPLIER_CODE" },
        align: "left",
        width: 80,
    },
    {
        dataIndex: "SUPPLIER_NAME",
        scopedSlots: { customRender: "SUPPLIER_NAME" },
        align: "left",
        width: 140,
        slots: { title: "SUPPLIER_NAME_INPUT" }
    },
    {
        dataIndex: "TRANSACTION_DATE",
        scopedSlots: { customRender: "TRANSACTION_DATE" },
        align: "left",
        width: 180,
        slots: { title: "TRANSACTION_DATE_FILTERS" },
        customRender: (text) => {
            return splitData(text);
        }
    },
    {
        dataIndex: "DOC_NO_PO",
        scopedSlots: { customRender: "DOC_NO_PO" },
        align: "left",
        width: 120,
        slots: { title: "DOC_NO_PO_FILTERS" }
    },
    {
        dataIndex: "PO_RECEIVE_TYPE",
        scopedSlots: { customRender: "PO_RECEIVE_TYPE" },
        align: "left",
        width: 80,
        slots: { title: "PO_RECEIVE_TYPE_SELECT" },
        customRender: (text) => {
            return text == 1 ? 'ALL' : text == 2 ? '进货' : "退货"
        }
    },
    {
        dataIndex: "DOC_NO_A",
        scopedSlots: { customRender: "DOC_NO_A" },
        align: "left",
        width: 100,
        slots: { title: "DOC_NO_A_FILTERS" }
    },
    {
        dataIndex: "DOC_NO_R",
        scopedSlots: { customRender: "DOC_NO_R" },
        align: "left",
        width: 100,
        slots: { title: "DOC_NO_R_FILTERS" }
    },
    {
        dataIndex: "PLANT_NAME",
        scopedSlots: { customRender: "PLANT_NAME" },
        align: "center",
        width: 100,
        slots: { title: "PLANT_NAME_P_SELECT" }
    },
    {
        dataIndex: "ITEM_CODE",
        align: "left",
        width: 150,
        slots: { title: "ITEM_CODE_INPUT" }
    },
    {
        dataIndex: "ITEM_DESCRIPTION",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "left",
        width: 150,
        slots: { title: "ITEM_NAME_INPUT" }
    },
    {
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "left",
        width: 200,
        slots: { title: "ITEM_SPECIFICATION_INPUT" }
    },
    {
        title: "计价单位",
        dataIndex: "UNIT_NAME",
        scopedSlots: { customRender: "UNIT_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "计价数量",
        dataIndex: "PRICE_QTY",
        scopedSlots: { customRender: "PRICE_QTY" },
        align: "center",
        width: 80,
    },
    {
        title: "单价",
        dataIndex: "DISCOUNTED_PRICE",
        scopedSlots: { customRender: "DISCOUNTED_PRICE" },
        align: "center",
        width: 80,
    },
    {
        title: "原币金额",
        dataIndex: "AMOUNT_O",
        scopedSlots: { customRender: "AMOUNT_O" },
        align: "center",
        width: 80,
    },
    {
        title: "交易币种",
        dataIndex: "CURRENCY_CODE",
        scopedSlots: { customRender: "CURRENCY_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "发票种类",
        dataIndex: "TAX_INVOICE_CATEGORY_NAME",
        scopedSlots: { customRender: "TAX_INVOICE_CATEGORY_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "税种",
        dataIndex: "TAX_NAME",
        scopedSlots: { customRender: "TAX_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "税率",
        dataIndex: "TAX_RATE",
        scopedSlots: { customRender: "TAX_RATE" },
        align: "center",
        width: 80,
    },
    {
        title: "汇率",
        dataIndex: "EXCHANGE_RATE",
        scopedSlots: { customRender: "EXCHANGE_RATE" },
        align: "center",
        width: 80,
    },
    {
        title: "本币金额",
        dataIndex: "AMOUNT_L",
        scopedSlots: { customRender: "AMOUNT_L" },
        align: "center",
        width: 80,
    },
    {
        title: "结算状态",
        dataIndex: "SETTLEMENT_CLOSE",
        scopedSlots: { customRender: "SETTLEMENT_CLOSE" },
        align: "center",
        width: 80,
        customRender: (text) => {
            return text == 0 ? '0.不需结算' : text == 1 ? '1.结算未完成' : "2.结算已完成";
        }
    },
    {
        title: "已结算数量",
        dataIndex: "SETTLEMENT_PRICE_QTY",
        scopedSlots: { customRender: "SETTLEMENT_PRICE_QTY" },
        align: "center",
        width: 80,
    },
    {
        title: "原币未税金额",
        dataIndex: "AMOUNT_UNINCLUDE_TAX_OC",
        scopedSlots: { customRender: "AMOUNT_UNINCLUDE_TAX_OC" },
        align: "center",
        width: 80,
    },
    {
        title: "原币税额",
        dataIndex: "TAX_OC",
        scopedSlots: { customRender: "TAX_OC" },
        align: "center",
        width: 80,
    },
    {
        title: "本币未税金额",
        dataIndex: "AMOUNT_UNINCLUDE_TAX_BC",
        scopedSlots: { customRender: "AMOUNT_UNINCLUDE_TAX_BC" },
        align: "center",
        width: 80,
    },
    {
        title: "原币税额",
        dataIndex: "TAX_BC",
        scopedSlots: { customRender: "TAX_BC" },
        align: "center",
        width: 80,
    },
    {
        title: "采购域编号",
        dataIndex: "SUPPLY_CENTER_CODE",
        scopedSlots: { customRender: "SUPPLY_CENTER_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "采购域名称",
        dataIndex: "SUPPLY_CENTER_NAME",
        scopedSlots: { customRender: "SUPPLY_CENTER_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "工厂/储运编号",
        dataIndex: "PLANT_CODE",
        scopedSlots: { customRender: "PLANT_CODE" },
        align: "center",
        width: 80,
    },
    // {
    //     title: "工厂/储运名称",
    //     dataIndex: "PLANT_NAME",
    //     scopedSlots: { customRender: "PLANT_NAME" },
    //     align: "center",
    //     width: 80,
    // },
    {
        title: "采购员姓名",
        dataIndex: "EMPLOYEE_NAME",
        scopedSlots: { customRender: "EMPLOYEE_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "部门名称",
        dataIndex: "ADMIN_UNIT_NAME",
        scopedSlots: { customRender: "ADMIN_UNIT_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "采购类型",
        dataIndex: "PURCHASE_TYPE",
        scopedSlots: { customRender: "PURCHASE_TYPE" },
        align: "center",
        width: 80,
    },
    {
        title: "商品类型",
        dataIndex: "ITEM_TYPE",
        scopedSlots: { customRender: "ITEM_TYPE" },
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
    }
];
export const columnsHeard = [
    {
        title: "工厂/储运编号",
        dataIndex: "PLANT_CODE",
    },
    {
        title: "工厂/储运名称",
        dataIndex: "PLANT_NAME",
    },
    {
        title: "供应商编号",
        dataIndex: "SUPPLIER_CODE",
    },
    {
        title: "供应商简称",
        dataIndex: "SUPPLIER_NAME",
    },
    {
        title: "交易日期",
        dataIndex: "TRANSACTION_DATE",
    },
    {
        title: "采购订单单号",
        dataIndex: "DOC_NO_PO",
    },
    {
        title: "进退货别",
        dataIndex: "PO_RECEIVE_TYPE",
    },
    {
        title: "进货/退货单号",
        dataIndex: "DOC_NO_A",
    },
    {
        title: "出/入货单号",
        dataIndex: "DOC_NO_R",
    },
    {
        title: "品号",
        dataIndex: "ITEM_CODE",
    },
    {
        title: "品名",
        dataIndex: "ITEM_DESCRIPTION",
        scopedSlots: { customRender: "ITEM_NAME" },
    },
    {
        title: "规格",
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "left",
        width: 200,
        slots: { title: "ITEM_SPECIFICATION_INPUT" }
    },
    {
        title: "采购员姓名",
        dataIndex: "EMPLOYEE_NAME",
        scopedSlots: { customRender: "EMPLOYEE_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "部门名称",
        dataIndex: "ADMIN_UNIT_NAME",
        scopedSlots: { customRender: "ADMIN_UNIT_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "计价单位",
        dataIndex: "UNIT_NAME",
        scopedSlots: { customRender: "UNIT_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "计价数量",
        dataIndex: "PRICE_QTY",
        scopedSlots: { customRender: "PRICE_QTY" },
        align: "center",
        width: 80,
    },
    {
        title: "采购类型",
        dataIndex: "PURCHASE_TYPE",
        scopedSlots: { customRender: "PURCHASE_TYPE" },
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
        title: "发票种类",
        dataIndex: "TAX_INVOICE_CATEGORY_NAME",
        scopedSlots: { customRender: "TAX_INVOICE_CATEGORY_NAME" },
        align: "center",
        width: 80,
    },
    {
        title: "交易币种",
        dataIndex: "CURRENCY_CODE",
        scopedSlots: { customRender: "CURRENCY_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "汇率",
        dataIndex: "EXCHANGE_RATE",
        scopedSlots: { customRender: "EXCHANGE_RATE" },
        align: "center",
        width: 80,
    },
    {
        title: "商品类型",
        dataIndex: "ITEM_TYPE",
        scopedSlots: { customRender: "ITEM_TYPE" },
        align: "center",
        width: 80,
    },


    {
        title: "税率",
        dataIndex: "TAX_RATE",
        scopedSlots: { customRender: "TAX_RATE" },
        align: "center",
        width: 80,
    },
    {
        title: "汇率",
        dataIndex: "EXCHANGE_RATE",
        scopedSlots: { customRender: "EXCHANGE_RATE" },
        align: "center",
        width: 80,
    },
    {
        title: "结算状态",
        dataIndex: "SETTLEMENT_CLOSE",
        scopedSlots: { customRender: "SETTLEMENT_CLOSE" },
        align: "center",
        width: 80,
        customRender: (text) => {
            return text == 0 ? '0.不需结算' : text == 1 ? '1.结算未完成' : "2.结算已完成";
        }
    },
    {
        title: "已结算数量",
        dataIndex: "SETTLEMENT_PRICE_QTY",
        scopedSlots: { customRender: "SETTLEMENT_PRICE_QTY" },
        align: "center",
        width: 80,
    },
    {
        title: "采购域编号",
        dataIndex: "SUPPLY_CENTER_CODE",
        scopedSlots: { customRender: "SUPPLY_CENTER_CODE" },
        align: "center",
        width: 80,
    },
    {
        title: "采购域名称",
        dataIndex: "SUPPLY_CENTER_NAME",
        scopedSlots: { customRender: "SUPPLY_CENTER_NAME" },
        align: "center",
        width: 80,
    },
];