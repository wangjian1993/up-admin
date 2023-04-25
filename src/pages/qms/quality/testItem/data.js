/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-04-08 11:46:08
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/qms/quality/testItem/data.js
 */
export const columns = [
  {
    title: "序号",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "业务公司",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "EnterName" },
    align: "center",
  },
  {
    title: "测试项目类型",
    dataIndex: "TypeName",
    scopedSlots: { customRender: "TypeName" },
    align: "center",
  },
  {
    title: "测试项目编码",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
  },
  {
    title: "测试项目名称",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "DateCreated",
    scopedSlots: { customRender: "DateCreated" },
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "UserCreatedName",
    scopedSlots: { customRender: "UserCreatedName" },
    align: "center",
  },
  {
    title: "修改时间",
    dataIndex: "DateModified",
    scopedSlots: { customRender: "DateModified" },
    align: "center",
  },
  {
    title: "修改人",
    dataIndex: "UserModifiedName",
    scopedSlots: { customRender: "UserModifiedName" },
    align: "center",
  },
  {
    title: "是否启用",
    dataIndex: "IsEnable",
    scopedSlots: { customRender: "Enable" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];