/*
 * @Author: max
 * @Date: 2022-04-29 17:34:40
 * @LastEditTime: 2022-05-24 09:11:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/plantInfo/data/lineServe.js
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
      title: "工厂名称",
      dataIndex: "PlantName",
      scopedSlots: { customRender: "PlantName" },
      align: "center",
    },
    {
      title: "车间名称",
      dataIndex: "WorkShopName",
      scopedSlots: { customRender: "WorkShopName" },
      align: "center",
    },
    {
      title: "产线名称",
      dataIndex: "LineName",
      scopedSlots: { customRender: "LineName" },
      align: "center",
    },
    {
      title: "服务配置编码",
      dataIndex: "ConfigCode",
      scopedSlots: { customRender: "ConfigCode" },
      align: "center",
    },
    {
      title: "服务配置名称",
      dataIndex: "ConfigName",
      scopedSlots: { customRender: "ConfigName" },
      align: "center",
    },
    {
      title: "服务配置类型",
      dataIndex: "ServiceTypeName",
      scopedSlots: { customRender: "ServiceTypeName" },
      align: "center",
    },
    {
      title: "IP地址",
      dataIndex: "IPAddress",
      scopedSlots: { customRender: "IPAddress" },
      align: "center",
    },
    {
      title: "端口号",
      dataIndex: "PortNo",
      scopedSlots: { customRender: "PortNo" },
      align: "center",
    },
    {
      title: "账号",
      dataIndex: "Account",
      scopedSlots: { customRender: "Account" },
      align: "center",
    },
    {
      title: "密码",
      dataIndex: "Password",
      scopedSlots: { customRender: "Password" },
      align: "center",
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" },
      align: "center",
    },
  ];