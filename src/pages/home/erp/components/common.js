/*
 * @Author: max
 * @Date: 2021-10-16 14:23:43
 * @LastEditTime: 2021-10-16 15:13:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomList/common.js
 */
export const general = [
    {
        title: "计量体系",
        dataIndex: "UNIT_MODE",
        span: 1,
    },
    {
        title: "批号管理",
        dataIndex: "LOT_CONTROL",
        span: 1,
    },
    {
        title: "库存单位",
        dataIndex: "UNIT_NAME_S",
        span: 1,
    },
    {
        title: "批号编码规则",
        dataIndex: "NO_RULE_CODE_L",
        span: 1,
    },
    {
        title: "序列号编码规则",
        dataIndex: "NO_RULE_CODE_S",
        span: 1,
    },
    {
        title: "第二单位",
        dataIndex: "UNIT_NAME_SE",
        span: 1,
    },
    {
        title: "修改批号有效日期",
        dataIndex: "LOT_FAILURE_CONTROL",
        span: 1,
    },
    {
        title: "特征码产生模式",
        dataIndex: "FEATURE_GENERATE_MODE",
        span: 1,
    },
    {
        title: "物流单位",
        dataIndex: "UNIT_NAME_L",
        span: 1,
    },
    {
        title: "批号等待天数",
        dataIndex: "LOT_WAITING_DAY",
        span: 1,
    },
    {
        title: "图号取自",
        dataIndex: "DRAWING_NO_FROM",
        span: 1,
    },
    {
        title: "库存检查方式",
        dataIndex: "INVENTORY_CHECK_BY",
        span: 1,
    },
    {
        title: "批号复检天数",
        dataIndex: "LOT_REINSPECTION_DAY",
        span: 1,
    },
    {
        title: "品号净重",
        dataIndex: "ITEM_NET_WEIGHT",
        span: 1,
    },
    {
        title: "库存检查方式",
        dataIndex: "INVENTORY_CHECK_BY",
        span: 1,
    },
    {
        title: "批号有效天数",
        dataIndex: "LOT_EXPIRE_DAY",
        span: 1,
    },
    {
        title: "重量单位",
        dataIndex: "UNIT_NAME_W",
        span: 1,
    },
    {
        title: "深圳存储位置",
        dataIndex: "UDF026",
        span: 1,
    },
    {
        title: "惠州存储位置",
        dataIndex: "UDF025",
        span: 1,
    },
    {
        title: "序列号管理",
        dataIndex: "ITEM_SN_MANAGEMENT",
        checkbox:true,
        span: 1,
    },
    {
        title: "存货管理",
        dataIndex: "INVENTORY_MANAGEMENT",
        checkbox:true,
        span: 1,
    },
];
export const storage = [
    {
        title: "工厂/储运",
        dataIndex: "PLANT_NAME_O",
        span: 1,
    },
    {
        title: "默认入库仓库",
        dataIndex: "WAREHOUSE_CODE_I",
        span: 1,
    },
    {
        title: "循环盘点码",
        dataIndex: "CYCLE_COUNT_CODE",
        span: 1,
    },
    {
        title: "存货交易单位",
        dataIndex: "UNIT_NAME_T",
        span: 1,
    },
    {
        title: "默认出库仓库",
        dataIndex: "WAREHOUSE_NAME_O",
        span: 1,
    },
    {
        title: "ABC等级",
        dataIndex: "ABC_CLASS",
        span: 1,
    },
    {
        title: "批号管理",
        dataIndex: "LOT_CONTROL",
        span: 1,
    },
    {
        title: "默认调出工厂/储运",
        dataIndex: "PLANT_NAME_O",
        span: 1,
    },
    {
        title: "保留控制",
        dataIndex: "RESERVED_CONTROL",
        span: 1,
    },
    {
        title: "出库策略",
        dataIndex: "WAREHOUSE_CONTROL",
        span: 1,
    },
    {
        title: "运输天数",
        dataIndex: "TRANSPORT_DAYS",
        span: 1,
    },
    {
        title: "保留原则",
        dataIndex: "RESERVED_RULE",
        span: 1,
    },
    {
        title: "品号类型",
        dataIndex: "ITEM_PROPERTY",
        span: 1,
    },
    {
        title: "备注",
        dataIndex: "REMARK",
        span: 1,
    },
    {
        title: "储存控制",
        dataIndex: "STORAGE_CONTROL",
        span: 1,
    },
    {
        title: "内部协同关系",
        dataIndex: "SUPPLY_SYNERGY_NAME",
        span: 1,
    },
    {
        title: "储存限制编号",
        dataIndex: "",
        span: 1,
    },
];
export const production = [
    {
        title: "工厂/储运",
        dataIndex: "PLANT_NAME_O",
        span: 1,
    },
    {
        title: "质检模式",
        dataIndex: "INSPECT_MODE",
        span: 1,
    },
    {
        title: "工艺管理",
        dataIndex: "ITEM_ROUTING_CONTROL",
        span: 1,
    },
    {
        title: "工作中心",
        dataIndex: "WORK_CENTER_NAME",
        span: 1,
    },
    {
        title: "品管类别",
        dataIndex: "QC_CATEGORY_NAME",
        span: 1,
    },
    {
        title: "生产部门",
        dataIndex: "ADMIN_UNIT_NAME",
        span: 1,
    },
    {
        title: "检验前置天数",
        dataIndex: "INSPECT_DAYS",
        span: 1,
    },
    {
        title: "标准工艺路线品号",
        dataIndex: "ITEM_CODE",
        span: 1,
    },
    {
        title: "默认采购域",
        dataIndex: "SUPPLY_CENTER_NAME",
        span: 1,
    },
    {
        title: "制造固定前置天数",
        dataIndex: "FIXED_LEAD_TIME_M",
        span: 1,
    },
    {
        title: "移转批量所需天数",
        dataIndex: "LOT_MO_LEAD_TIME",
        span: 1,
    },
    {
        title: "领用单位",
        dataIndex: "UNIT_NAME_IS",
        span: 1,
    },
    {
        title: "制造变动前置天数",
        dataIndex: "DYNAMIC_LEAD_TIME_M",
        span: 1,
    },
    {
        title: "批工单数量",
        dataIndex: "LOT_MO_QTY",
        span: 1,
    },
    {
        title: "领料模式",
        dataIndex: "ISSUE_TYPE",
        span: 1,
    },
    {
        title: "前置天数计算批量",
        dataIndex: "BATCH_QUANTITY_M",
        span: 1,
    },
    {
        title: "超领率",
        dataIndex: "ISSUE_OVERRUN_RATE",
        span: 1,
    },
    {
        title: "领料对象类型",
        dataIndex: "ISSUE_DESTINATION_TYPE",
        span: 1,
    },
    {
        title: "缺领率",
        dataIndex: "ISSUE_SHORTAGE_RATE",
        span: 1,
    },
    {
        title: "超入率",
        dataIndex: "RECEIPT_OVERRUN_RATE",
        span: 1,
    },
    {
        title: "领用倍量",
        dataIndex: "ISSUE_MULTIPLE",
        span: 1,
    },
    {
        title: "领料关键料",
        dataIndex: "ISSUE_CRITICAL",
        checkbox:true,
        span: 1,
    },
];
export const plant = [
    {
        title: "工厂/储运:",
        dataIndex: "PLANT_NAME_O",
        span: 1,
    },
    {
        title: "补货政策",
        dataIndex: "ORDER_POLICY",
        span: 1,
    }, {
        title: "工单单据类型",
        dataIndex: "DOC_NAME_MO",
        span: 1,
    },
    {
        title: "补货周期",
        dataIndex: "TIME_BUCKET_NAME_CY",
        span: 1,
    },
    {
        title: "并单周期",
        dataIndex: "CONSOLIDATE_DAY",
        span: 1,
    }, {
        title: "请购单单据类型",
        dataIndex: "DOC_NAME_PR",
        span: 1,
    },
    {
        title: "内部订单单据类型",
        dataIndex: "DOC_NAME_IN",
        span: 1,
    },
    {
        title: "最小补量",
        dataIndex: "MIN_ORDER_QTY",
        span: 1,
    }, {
        title: "调拨申请单单据类型",
        dataIndex: "DOC_NAME_TW",
        span: 1,
    },
    {
        title: "补货倍量",
        dataIndex: "ORDER_MULTIPLE",
        span: 1,
    },
    {
        title: "最优库存量",
        dataIndex: "BEST_STOCK",
        span: 1,
    }, {
        title: "最大补量",
        dataIndex: "MAX_ORDER_QTY",
        span: 1,
    },
    {
        title: "循环补货码",
        dataIndex: "CYCLE_ORDER_CODE",
        span: 1,
    },
    {
        title: "MRP时距",
        dataIndex: "TIME_BUCKET_NAME",
        span: 1,
    }, {
        title: "计划人员",
        dataIndex: "计划人员",
        span: 1,
    },
    {
        title: "补货提前期",
        dataIndex: "ORDER_LEAD",
        span: 1,
    },
    {
        title: "是否并批开单",
        dataIndex: "IS_CONSOLIDATED",
        span: 1,
    }, {
        title: "采购件由计划考虑补货机制",
        dataIndex: "PURCHASE_CONSIDER_ORDER",
        span: 1,
        checkbox:true
    },
    {
        title: "关键料",
        dataIndex: "ISSUE_CRITICAL",
        span: 1,
        checkbox:true
    },
    {
        title: "整数规划",
        dataIndex: "IS_INTEGER",
        span: 1,
        checkbox:true
    },
    {
        title: "独立需求",
        dataIndex: "IS_INDEPENDENT_DEMAND",
        span: 1,
        checkbox:true
    }
];
export const finance = [
    {
        title: "公司",
        dataIndex: "COMPANY_NAME",
        span: 1,
    },
    {
        title: "存货会计分类",
        dataIndex: "IM_FICATEGORY_NAME",
        span: 1,
    },
    {
        title: "存货成本分类",
        dataIndex: "IM_COST_CATEGORY_NAME",
        span: 1,
    },
    {
        title: "在制约量估算分类",
        dataIndex: "IM_COST_CATEGORY2_NAME",
        span: 1,
    },
    {
        title: "税目",
        dataIndex: "TAX_CATEGORY_NAME",
        span: 1,
    },
    {
        title: "品号销售保修分类",
        dataIndex: "ISWARR_CATEGORY_NAME",
        span: 1,
    },
    {
        title: "备注",
        dataIndex: "REMARK",
        span: 1,
    },
    {
        title: "按特征码区分成本",
        dataIndex: "ISWARR_CATEGORY_NAME",
        span: 1,
    },
];