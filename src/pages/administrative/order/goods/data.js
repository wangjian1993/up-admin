/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-04-06 16:44:53
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/goods/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "餐品分类",
    dataIndex: "ClassifyName",
    scopedSlots: { customRender: "ClassifyName" },
    align: "center",
  },
  {
    title: "餐品编码",
    dataIndex: "GoodsCode",
    scopedSlots: { customRender: "GoodsCode" },
    align: "center",
  },
  {
    title: "餐品名称",
    dataIndex: "GoodsName",
    scopedSlots: { customRender: "GoodsName" },
    align: "center",
  },
  {
    title: "公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
  },
  {
    title: "地点",
    dataIndex: "Addresss",
    scopedSlots: { customRender: "Addresss" },
    align: "center",
    width:250,
  },
  {
    title: "餐品库存",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "Unit",
    scopedSlots: { customRender: "Unit" },
    align: "center",
  },
  {
    title: "预订/现货",
    dataIndex: "IsSpotGoods",
    scopedSlots: { customRender: "IsSpotGoods" },
    align: "center",
    customRender: (text) => {
      return text ? '现货' : "预订"
    }
  },
  {
    title: "餐品图片",
    dataIndex: "PictureUrl",
    scopedSlots: { customRender: "PictureUrl" },
    align: "center",
  },
  {
    title: "价格",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" },
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "Sort",
    scopedSlots: { customRender: "Sort" },
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "CreateUser",
    scopedSlots: { customRender: "CreateUser" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "CreateDatetime",
    scopedSlots: { customRender: "CreateDatetime" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100
  },
];
export const innerColumns = [{
  title: " 顺序",
  dataIndex: "index",
  scopedSlots: { customRender: "index" },
  align: "center",
}, {
  title: "接收部门",
  dataIndex: "DepartmentName",
  scopedSlots: { customRender: "DepartmentName" },
  align: "center",
}, {
  title: "接收人",
  dataIndex: "ReceiverList",
  scopedSlots: { customRender: "ReceiverList" },
  align: "center",
}];