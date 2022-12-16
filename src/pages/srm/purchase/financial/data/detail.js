/*
 * @Author: max
 * @Date: 2022-08-11 13:55:08
 * @LastEditTime: 2022-12-12 17:05:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/financial/data/detail.js
 */
export const info1 = [{
    title: '供应商',
    dataIndex: "SupplierFullName"
}, {
    title: '费用单号',
    dataIndex: "OrderNo"
}];
export const info2 = [{
    title: '开户号',
    dataIndex: "Bank"
}, {
    title: '银行账户',
    dataIndex: "BankCard"
}, {
    title: '纳税人识别号',
    dataIndex: "TaxpayerIdNumber"
}];
export const info3 = [{
    title: '币种',
    dataIndex: "Currency"
}, {
    title: '税率',
    dataIndex: "Rate"
}, {
    title: '抵扣发票',
    dataIndex: "IsDeduct"
}, {
    title: '是否内部',
    dataIndex: "IsInternal"
}, {
    title: '单据来源',
    dataIndex: "Source"
}, {
    title: '费用周期',
    dataIndex: "ExpenseCycle"
}];
export const columns = [
    {
        title: "费用摘要",
        dataIndex: "ExpenseTitle",
        scopedSlots: { customRender: "expenseTitle" },
        align: "center",
    },
    {
        title: "费用类型",
        dataIndex: "ExpenseType",
        scopedSlots: { customRender: "expenseType" },
        align: "center",
    },
    {
        title: "费用原因",
        dataIndex: "ExpenseReason",
        scopedSlots: { customRender: "expenseReason" },
        align: "center",
    },
    {
        title: "费用类别",
        dataIndex: "ExpenseClass",
        scopedSlots: { customRender: "expenseClass" },
        align: "center",
    },
    {
        title: "费用金额",
        dataIndex: "ExpenseMoney",
        scopedSlots: { customRender: "expenseMoney" },
        align: "center",
    },
    {
        title: "费用日期",
        dataIndex: "ExpenseDate",
        scopedSlots: { customRender: "expenseDate" },
        align: "center",
    },
    {
        title: "成本中心",
        dataIndex: "Cost",
        scopedSlots: { customRender: "cost" },
        align: "center",
    },
    {
        title: "内部订单",
        dataIndex: "Internal",
        scopedSlots: { customRender: "internal" },
        align: "center",
    },
    {
        title: "备注说明",
        dataIndex: "Remark",
        scopedSlots: { customRender: "remark" },
        align: "center",
    },
];
export const columnKeys = [
    {
        title: "合计金额",
        dataIndex: "totalMoney",
        scopedSlots: { customRender: "totalMoney" },
        align: "center",
        width: 105,
    },
]