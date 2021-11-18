/*
 * @Author: max
 * @Date: 2021-11-18 08:52:55
 * @LastEditTime: 2021-11-18 08:52:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomReverseQuery/data.js
 */
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width: "3%",
    },
    {
      title: "主件品号",
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
      ellipsis: true,
    },
    {
      title: "规格",
      dataIndex: "ITEM_SPECIFICATION",
      scopedSlots: { customRender: "ITEM_SPECIFICATION" },
      align: "center",
      width: 300,
      ellipsis: true,
    },
    {
      title: "图号",
      dataIndex: "DRAWING_NO",
      scopedSlots: { customRender: "DRAWING_NO" },
      align: "center",
      width: 150,
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
    },
    {
      title: "底数",
      dataIndex: "DENOMINATOR",
      scopedSlots: { customRender: "DENOMINATOR" },
      align: "center",
    },
    {
      title: "固定损耗量",
      dataIndex: "FIXED_LOSS_RATE",
      scopedSlots: { customRender: "FIXED_LOSS_RATE" },
      align: "center",
      width: 100,
    },
    {
      title: "变动损耗",
      dataIndex: "DYNAMIC_LOSS_RATE",
      scopedSlots: { customRender: "DYNAMIC_LOSS_RATE" },
      align: "center",
      width: 80,
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      fixed: "right",
      width: 100,
    },
  ];