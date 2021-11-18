/*
 * @Author: max
 * @Date: 2021-11-18 08:55:26
 * @LastEditTime: 2021-11-18 08:55:27
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/EcnVariation/data.js
 */
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width: 50,
    },
    {
      title: "ECN单号",
      dataIndex: "DOC_NO",
      scopedSlots: { customRender: "DOC_NO" },
      align: "center",
      width: 200,
    },
    {
      title: "单据类型",
      dataIndex: "DOC_NAME",
      scopedSlots: { customRender: "DOC_NAME" },
      align: "center",
      width: 150,
      ellipsis: true,
    },
    {
      title: "单据日期",
      dataIndex: "DOC_DATE",
      scopedSlots: { customRender: "DOC_DATE" },
      align: "center",
      width: 150,
      ellipsis: true,
    },
    {
      title: "变更原因",
      dataIndex: "DESCRIPTION_1",
      scopedSlots: { customRender: "DESCRIPTION_1" },
      align: "center",
      width: 200,
      ellipsis: true,
    },
    {
      title: "变更原因说明",
      dataIndex: "REASON_DESC",
      scopedSlots: { customRender: "REASON_DESC" },
      align: "center",
      width: 150,
    },
    {
      title: "变更部门",
      dataIndex: "ADMIN_UNIT_NAME_T",
      scopedSlots: { customRender: "ADMIN_UNIT_NAME_T" },
      align: "center",
      width: 80,
    },
    {
      title: "主办人",
      dataIndex: "EMPLOYEE_NAME_T",
      scopedSlots: { customRender: "EMPLOYEE_NAME_T" },
      align: "center",
      width: 150,
      ellipsis: true,
    },
    {
      title: "变更范围",
      dataIndex: "CONTENT",
      scopedSlots: { customRender: "CONTENT" },
      align: "center",
      width: 80,
    },
    {
      title: "专案负责人",
      dataIndex: "EMPLOYEE_NAME",
      scopedSlots: { customRender: "EMPLOYEE_NAME" },
      align: "center",
      width: 80,
    },
    {
      title: "紧急等级",
      dataIndex: "DESCRIPTION_2",
      scopedSlots: { customRender: "DESCRIPTION_2" },
      align: "center",
      width: 80,
    },
    {
      title: "审核码",
      dataIndex: "ApproveStatus",
      scopedSlots: { customRender: "ApproveStatus" },
      align: "center",
      width: 60,
    },
    {
      title: "审核日期",
      dataIndex: "ApproveDate",
      scopedSlots: { customRender: "ApproveDate" },
      align: "center",
      width: 110,
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
      width: 100,
    },
  ];