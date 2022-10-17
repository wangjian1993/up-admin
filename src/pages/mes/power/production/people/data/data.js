/*
 * @Author: max
 * @Date: 2022-04-30 14:05:19
 * @LastEditTime: 2022-10-14 11:22:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/production/people/data/data.js
 */

// import { splitData } from "@/utils/util.js";
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "用户工号",
    dataIndex: "UserCode",
    scopedSlots: { customRender: "UserCode" },
    align: "center",
  },
  {
    title: "用户姓名",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
  },
  {
    title: "生产车间",
    dataIndex: "WorkshopName",
    scopedSlots: { customRender: "WorkshopName" },
    align: "center",
  },
  {
    title: "生产产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "是否启用",
    dataIndex: "Enable",
    scopedSlots: { customRender: "Enable" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
    customRender: (text) => {
      let str = text.split("T")
      return str[0] + " " + str[1];
    }
  },
  {
    title: "创建人",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];