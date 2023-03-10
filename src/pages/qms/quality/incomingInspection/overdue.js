/*
 * @Author: max
 * @Date: 2022-04-01 17:38:43
 * @LastEditTime: 2023-03-06 17:24:00
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/quality/incomingInspection/overdue.js
 */
/*
 * @Author: max
 * @Date: 2021-11-15 09:05:35
 * @LastEditTime: 2021-11-17 15:05:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/data.js
 */
export const columns = [
    {
      title: "序号",
      dataIndex: "index",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "业务公司",
      dataIndex: "EnterName",
      scopedSlots: { customRender: "EnterName" },
      align: "center",
      width:100,
    },
    {
      title: "到货单号",
      dataIndex: "ArrivalOrderNo",
      scopedSlots: { customRender: "ArrivalOrderNo" },
      align: "center",
      width:100,
    },
    {
      title: "供应商",
      dataIndex: "SupplierName",
      scopedSlots: { customRender: "SupplierName" },
      align: "center",
      width:100,
    },
    {
      title: "品号",
      dataIndex: "MitemCode",
      scopedSlots: { customRender: "MitemCode" },
      align: "center",
      width:90,
    },
    {
      title: "品名",
      dataIndex: "MitemName",
      scopedSlots: { customRender: "MitemName" },
      align: "center",
      width: 180,
    },
    {
      title: "规格",
      dataIndex: "MitemSpec",
      scopedSlots: { customRender: "MitemSpec" },
      align: "center",
      width:220,
    },
    {
      title: "PO号",
      dataIndex: "PurchaseOrderNo",
      scopedSlots: { customRender: "PurchaseOrderNo" },
      align: "center",
      width:100,
    },
    {
      title: "来料数量",
      dataIndex: "InComingQty",
      scopedSlots: { customRender: "InComingQty" },
      align: "center",
      width:80,
    },
   
    {
      title: "测试项目",
      dataIndex: "TestItemName",
      scopedSlots: { customRender: "TestItemName" },
      align: "center",
      width:120,
    },
    {
      title: "测试结果",
      dataIndex: "TestResultName",
      scopedSlots: { customRender: "TestResultName" },
      align: "center",
      width:80,
    },
    {
      title: "测试人",
      dataIndex: "UserTestName",
      scopedSlots: { customRender: "UserTestName" },
      align: "center",
      width:100,
    },
    {
      title: "测试时间",
      dataIndex: "DateTest",
      scopedSlots: { customRender: "DateTest" },
      align: "center",
      width:110,
    },
    {
      title: "备注",
      dataIndex: "Remarks",
      scopedSlots: { customRender: "Remarks" },
      align: "center",
      width:80,
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];