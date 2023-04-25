/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-03-21 11:48:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/order/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "订单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
  },
  {
    title: "公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
  },
  {
    title: "点单地点",
    dataIndex: "Place",
    scopedSlots: { customRender: "Place" },
    align: "center",
  },
  {
    title: "点单人",
    dataIndex: "CreateUser",
    scopedSlots: { customRender: "CreateUser" },
    align: "center",
  },
  {
    title: "点单时间",
    dataIndex: "CreateDatetime",
    scopedSlots: { customRender: "CreateDatetime" },
    align: "center",
  },
  {
    title: "订单状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "订单备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
  {
    title: "联系人",
    dataIndex: "MobilePhone",
    scopedSlots: { customRender: "MobilePhone" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];