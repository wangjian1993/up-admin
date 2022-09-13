/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2022-09-06 11:27:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/orderPrice/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "导入批次号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
    width: 100,
  },
  {
    title: "内部订单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
    width: 100,
  },
  {
    title: "内部订单序号",
    dataIndex: "OrderNoSort",
    scopedSlots: { customRender: "OrderNoSort" },
    align: "center",
    width: 200,
  },
  {
    title: "料号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
    width: 100,
  },
  {
    title: "价格",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
    align: "center",
    width: 100,
  },
  {
    title: "导入时间",
    dataIndex: "DatetimeCteated",
    scopedSlots: { customRender: "DatetimeCteated" },
    align: "center",
    width: 100,
  },
  {
    title: "导入用户",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
    width: 100,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: 100,
  },
];