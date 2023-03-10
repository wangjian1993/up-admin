/*
 * @Author: max
 * @Date: 2022-04-01 17:38:43
 * @LastEditTime: 2023-02-23 18:11:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/report/overdue.js
 */
/*
 * @Author: max
 * @Date: 2021-11-15 09:05:35
 * @LastEditTime: 2021-11-17 15:05:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/data.js
 */
export const columnsData = [
    {
      title: "序号",
      dataIndex: "index",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "生产工厂/车间/产线",
      dataIndex: "Plant",
      scopedSlots: { customRender: "Plant" },
      align: "center",
      width:150,
    },
    {
      title: "工单号",
      dataIndex: "MoCode",
      scopedSlots: { customRender: "MoCode" },
      align: "center",
      width:100,
    },
    {
      title: "工单数量",
      dataIndex: "MoQty",
      scopedSlots: { customRender: "MoQty" },
      align: "center",
      width:80,
    },
    {
      title: "品号",
      dataIndex: "ProCode",
      scopedSlots: { customRender: "ProCode" },
      align: "center",
      width:90,
    },
    {
      title: "品名",
      dataIndex: "ProName",
      scopedSlots: { customRender: "ProName" },
      align: "center",
      width: "200px",
    },
    {
      title: "投料工序",
      dataIndex: "ProcessName",
      scopedSlots: { customRender: "ProcessName" },
      align: "center",
      width:100,
    },
    {
      title: "投料时间",
      dataIndex: "DateTimeRelease",
      scopedSlots: { customRender: "DateTimeRelease" },
      align: "center",
      width:100,
    },
    {
      title: "投料人",
      dataIndex: "UserRelease",
      scopedSlots: { customRender: "UserRelease" },
      align: "center",
      width:100,
    },
   
    {
      title: "产品追溯条码",
      dataIndex: "QrCode",
      scopedSlots: { customRender: "QrCode" },
      align: "center",
      width:120,
    },
    {
      title: "投料数量",
      dataIndex: "ReleaseQty",
      scopedSlots: { customRender: "ReleaseQty" },
      align: "center",
      width:80,
    },
    {
      title: "投料料号",
      dataIndex: "MitemCode",
      scopedSlots: { customRender: "MitemCode" },
      align: "center",
      width:100,
    },
    {
      title: "投料料名",
      dataIndex: "MitemName",
      scopedSlots: { customRender: "MitemName" },
      align: "center",
      width:100,
    },
    {
      title: "采购单号",
      dataIndex: "PurchaseOrderNo",
      scopedSlots: { customRender: "PurchaseOrderNo" },
      align: "center",
      width:100,
    },
    {
      title: "供应商编码",
      dataIndex: "SupplierCode",
      scopedSlots: { customRender: "SupplierCode" },
      align: "center",
      width:100,
    },
    {
      title: "供应商名称",
      dataIndex: "SupplierName",
      scopedSlots: { customRender: "SupplierName" },
      align: "center",
      width:100,
    },
  ];