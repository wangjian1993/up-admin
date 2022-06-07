/*
 * @Author: max
 * @Date: 2022-05-05 11:32:50
 * @LastEditTime: 2022-05-31 09:57:33
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/device/config/list.js
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
    title: "工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "车间",
    dataIndex: "WorkShopName",
    scopedSlots: { customRender: "WorkShopName" },
    align: "center",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "设备类型",
    dataIndex: "EquimentTypeName",
    scopedSlots: { customRender: "EquimentTypeName" },
    align: "center",
  },
  {
    title: "设备品牌",
    dataIndex: "BrandName",
    scopedSlots: { customRender: "BrandName" },
    align: "center",
  },
  {
    title: "设备编码",
    dataIndex: "EquimentCode",
    scopedSlots: { customRender: "EquimentCode" },
    align: "center",
  },
  {
    title: "设备名称",
    dataIndex: "EquimentName",
    scopedSlots: { customRender: "EquimentName" },
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "EquimentDesc",
    scopedSlots: { customRender: "EquimentDesc" },
    align: "center",
  },
  {
    title: "IP地址端口",
    dataIndex: "IPPort",
    scopedSlots: { customRender: "IPPort" },
    align: "center",
    customRender: (text, record) => {
      return record.IPAddress + ":" + record.IPPort;
    }
  },
  {
    title: "MAC地址",
    dataIndex: "MacAddress",
    scopedSlots: { customRender: "MacAddress" },
    align: "center",
  },
  {
    title: "设备状态",
    dataIndex: "StatusName",
    scopedSlots: { customRender: "StatusName" },
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