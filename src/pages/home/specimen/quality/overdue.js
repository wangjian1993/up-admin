/*
 * @Author: max
 * @Date: 2022-04-01 17:38:43
 * @LastEditTime: 2023-03-25 16:13:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/quality/overdue.js
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
      title: "公司名称",
      dataIndex: "EnterpriseName",
      scopedSlots: { customRender: "EnterpriseName" },
      align: "center",
    },
    {
      title: "到货单号",
      dataIndex: "DocNo",
      scopedSlots: { customRender: "DocNo" },
      align: "center",
    },
    {
      title: "供应商名称",
      dataIndex: "Supplier",
      scopedSlots: { customRender: "Supplier" },
      align: "center",
    },
    {
      title: "品号",
      dataIndex: "ItemCode",
      scopedSlots: { customRender: "ItemCode" },
      align: "center",
    },
    {
      title: "品名",
      dataIndex: "ItemName",
      scopedSlots: { customRender: "ItemName" },
      align: "center",
      width: 180,
    },
    {
      title: "规格",
      dataIndex: "ItemSpecification",
      scopedSlots: { customRender: "ItemSpecification" },
      align: "center",
      width:220,
    },
    {
      title: "图号",
      dataIndex: "DrawingNo",
      scopedSlots: { customRender: "DrawingNo" },
      align: "center",
    },
    {
      title: "来料数量",
      dataIndex: "ReturnReason",
      scopedSlots: { customRender: "ReturnReason" },
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "TableStatus",
      scopedSlots: { customRender: "TableStatus" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];