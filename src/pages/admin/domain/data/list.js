/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-09-01 10:37:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/domain/data/list.js
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
      title: "采购域编码",
      dataIndex: "AreaCode",
      scopedSlots: { customRender: "PlantCode" },
      align: "center",
    },
    {
      title: "采购域名称",
      dataIndex: "AreaName",
      scopedSlots: { customRender: "AreaName" },
      align: "center",
    },
    {
      title: "机构",
      dataIndex: "CompanyNames",
      scopedSlots: { customRender: "CompanyNames" },
      align: "center",
    },
    {
      title: "是否启用",
      dataIndex: "Enable",
      scopedSlots: { customRender: "Enable" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];