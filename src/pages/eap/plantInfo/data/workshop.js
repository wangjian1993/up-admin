/*
 * @Author: max
 * @Date: 2022-04-29 17:35:33
 * @LastEditTime: 2022-05-06 18:09:10
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/plantInfo/data/workshop.js
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
      title: "工厂编码",
      dataIndex: "PlantCode",
      scopedSlots: { customRender: "PlantCode" },
      align: "center",
    },
    {
      title: "工厂名称",
      dataIndex: "PlantName",
      scopedSlots: { customRender: "PlantName" },
      align: "center",
    },
    {
      title: "车间编码",
      dataIndex: "WorkShopCode",
      scopedSlots: { customRender: "WorkShopCode" },
      align: "center",
    },
    {
      title: "车间名称",
      dataIndex: "WorkShopName",
      scopedSlots: { customRender: "WorkShopName" },
      align: "center",
    },
    {
      title: "创建时间",
      dataIndex: "DateTimeCreated",
      scopedSlots: { customRender: "DateTimeCreated" },
      align: "center",
    },
    {
      title: "创建人",
      dataIndex: "UserCreated",
      scopedSlots: { customRender: "UserCreated" },
      align: "center",
    },
    {
      title: "修改时间",
      dataIndex: "DateTimeModified",
      scopedSlots: { customRender: "DateTimeModified" },
      align: "center",
    },
    {
      title: "修改人",
      dataIndex: "UserModified",
      scopedSlots: { customRender: "UserModified" },
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