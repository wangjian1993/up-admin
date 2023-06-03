/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-05-04 16:55:31
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/push/config/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "看板编码",
    dataIndex: "KanbanCode",
    scopedSlots: { customRender: "KanbanCode" },
    align: "center",
  },
  {
    title: "看板名称",
    dataIndex: "KanbanName",
    scopedSlots: { customRender: "KanbanName" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "KanbanDesc",
    scopedSlots: { customRender: "KanbanDesc" },
    align: "center",
  },
  {
    title: "URL",
    dataIndex: "KanbanUrl",
    scopedSlots: { customRender: "KanbanUrl" },
    align: "center",
    width:350
  },
  {
    title: "修改人",
    dataIndex: "Updater",
    scopedSlots: { customRender: "Updater" },
    align: "center",
  },
  {
    title: "修改时间",
    dataIndex: "UpdateTime",
    scopedSlots: { customRender: "UpdateTime" },
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "Creater",
    scopedSlots: { customRender: "Creater" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "CreateTime",
    scopedSlots: { customRender: "CreateTime" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];