/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-09-05 10:15:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/data/contacts.js
 */

// import { splitData } from "@/utils/util.js";
export const columns = [
    {
      title: "序号",
      scopedSlots: { customRender: "index" },
      align: "center",
      width:50,
    },
    {
      title: "姓名",
      dataIndex: "Name",
      scopedSlots: { customRender: "Name" },
      align: "center",
    },
    {
      title: "部门",
      dataIndex: "Department",
      scopedSlots: { customRender: "Department" },
      align: "center",
    },
    {
      title: "传真",
      dataIndex: "fax",
      scopedSlots: { customRender: "fax" },
      align: "center",
    },
    {
      title: "联系电话",
      dataIndex: "MobilePhone",
      scopedSlots: { customRender: "MobilePhone" },
      align: "center",
    },
    {
      title: "手机",
      dataIndex: "Phone",
      scopedSlots: { customRender: "Phone" },
      align: "center",
    },
    {
      title: "邮箱",
      dataIndex: "Email",
      scopedSlots: { customRender: "Email" },
      align: "center",
    },
    {
      title: "微信",
      dataIndex: "Wechat",
      scopedSlots: { customRender: "Wechat" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];