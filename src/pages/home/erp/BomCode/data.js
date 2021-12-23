/*
 * @Author: max
 * @Date: 2021-11-18 08:48:13
 * @LastEditTime: 2021-12-22 09:21:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomCode/data.js
 */
export const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "index" },
        align: "center",
        width: 50,
    },
    {
        dataIndex: "ITEM_CODE",
        align: "left",
        width: 150,
        slots: { title: "ITEM_CODE_INPUT" },
    },
    {
        title: "工厂编号",
        dataIndex: "PLANT_CODE_P",
        scopedSlots: { customRender: "PLANT_CODE_P" },
        align: "left",
        width: 65,
    },
    {
        dataIndex: "PLANT_NAME_P",
        scopedSlots: { customRender: "PLANT_NAME_P" },
        align: "left",
        width: 100,
        slots: { title: "PLANT_NAME_P_SELECT" }
    },
    {
        dataIndex: "ITEM_NAME",
        scopedSlots: { customRender: "ITEM_NAME" },
        align: "left",
        width: 150,
        slots: { title: "ITEM_NAME_INPUT" },
    },
    {
        dataIndex: "ITEM_SPECIFICATION",
        scopedSlots: { customRender: "ITEM_SPECIFICATION" },
        align: "left",
        width: 200,
        slots: { title: "ITEM_SPECIFICATION_INPUT" }
    },
    {
        dataIndex: "ApproveStatus",
        scopedSlots: { customRender: "ApproveStatus" },
        align: "center",
        width: 90,
        slots: { title: "ApproveStatus_SELECT" }
    },
    {
        dataIndex: "DRAWING_NO",
        scopedSlots: { customRender: "DRAWING_NO" },
        align: "left",
        width: 150,
        slots: { title: "DRAWING_NO_INPUT" }
    },
    {
        title: "库存单位",
        dataIndex: "UNIT_NAME",
        scopedSlots: { customRender: "UNIT_NAME" },
        align: "center",
        width: 80,
        customRender: (text, record) => {
            return record.UNIT_NAME_S;
        },
    },
    {
        title: "采购单位",
        dataIndex: "UNIT_NAME_S",
        scopedSlots: { customRender: "UNIT_NAME_S" },
        align: "center",
        width: 80,
    },
    {
        title: "品号类型",
        dataIndex: "ITEM_PROPERTY",
        scopedSlots: { customRender: "ITEM_PROPERTY" },
        align: "center",
        width: 80,
    },
    {
        title: "默认入库仓库",
        dataIndex: "WAREHOUSE_CODE_I",
        scopedSlots: { customRender: "WAREHOUSE_CODE_I" },
        align: "center",
        width: 100,
    },
    {
        title: "默认入库仓库名称",
        dataIndex: "WAREHOUSE_NAME_I",
        scopedSlots: { customRender: "WAREHOUSE_NAME_I" },
        align: "center",
        width: 80,
    },
    {
        title: "默认出库仓库",
        dataIndex: "WAREHOUSE_CODE_O",
        scopedSlots: { customRender: "WAREHOUSE_CODE_O" },
        align: "center",
        width: 60,
    },
    {
        title: "默认出库仓库名称",
        dataIndex: "WAREHOUSE_NAME_O",
        scopedSlots: { customRender: "WAREHOUSE_NAME_O" },
        align: "center",
        width: 80,
    },
    {
        title: "批号管理",
        dataIndex: "LOT_CONTROL",
        scopedSlots: { customRender: "LOT_CONTROL" },
        align: "center",
        width: 50,
        customRender: (text) => {
            return text == "N" ? "需要" : text == "T" ? " 需要且检查库存量" : "需要不检查库存量";
        },
    },
    {
        title: "品控模式",
        dataIndex: "INSPECT_MODE",
        scopedSlots: { customRender: "INSPECT_MODE" },
        align: "center",
        width: 50,
        customRender: (text) => {
            return text == 1 ? "免检" : text == 2 ? "执行质检流程" : "仅记录质检结果";
        },
    },
    {
        title: "工艺管理",
        dataIndex: "ITEM_ROUTING_CONTROL",
        scopedSlots: { customRender: "ITEM_ROUTING_CONTROL" },
        align: "center",
        width: 50,
        customRender: (text) => {
            return text == 0 ? "不启用" : text == 1 ? "按品号设置" : "按特征码设置";
        },
    },
    {
        title: "是否并批开单",
        dataIndex: "IS_CONSOLIDATED",
        scopedSlots: { customRender: "IS_CONSOLIDATED" },
        align: "center",
        width: 60,
        customRender: (text) => {
            return text == "N" ? "是" : "否";
        },
    },
    {
        title: "标准工艺路线",
        dataIndex: "ROUTING_CODE",
        scopedSlots: { customRender: "ROUTING_CODE" },
        align: "center",
        width: 60,
    },
    {
        title: "标准工艺路线说明位",
        dataIndex: "ROUTING_DES",
        scopedSlots: { customRender: "ROUTING_DES" },
        align: "center",
        width: 90,
    },
    {
        title: "工作中心编号",
        dataIndex: "WORK_CENTER_CODE",
        scopedSlots: { customRender: "WORK_CENTER_CODE" },
        align: "center",
        width: 60,
    },
    {
        title: "工作中心名称",
        dataIndex: "WORK_CENTER_NAME",
        scopedSlots: { customRender: "WORK_CENTER_NAME" },
        align: "center",
        width: 60,
    },
    {
        title: "生产部门编号",
        dataIndex: "ADMIN_UNIT_CODE",
        scopedSlots: { customRender: "ADMIN_UNIT_CODE" },
        align: "center",
        width: 60,
    },
    {
        title: "生产部门名称",
        dataIndex: "ADMIN_UNIT_NAME",
        scopedSlots: { customRender: "ADMIN_UNIT_NAME" },
        align: "center",
        width: 60,
    },
    {
        title: "快捷码",
        dataIndex: "SHORTCUT",
        scopedSlots: { customRender: "SHORTCUT" },
        align: "center",
        width: 60,
    },
    {
        title: "操作",
        scopedSlots: { customRender: "action" },
        align: "center",
        fixed: "right",
        width: 100,
    },
];