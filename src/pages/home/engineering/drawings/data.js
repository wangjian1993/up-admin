/*
 * @Author: max
 * @Date: 2022-05-11 11:49:33
 * @LastEditTime: 2023-05-15 10:16:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/engineering/drawings/data.js
 */
export const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "公司",
    dataIndex: "CompanyName",
    scopedSlots: { customRender: "CompanyName" },
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "图纸名称",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: "物料规格",
    dataIndex: "MitemSpec",
    scopedSlots: { customRender: "MitemSpec" },
    align: "center",
    width:350
  },
  {
    title: "图号",
    dataIndex: "DrawingNo",
    scopedSlots: { customRender: "DrawingNo" },
    align: "center",
  },
  {
    title: "品号创建时间",
    dataIndex: "DatetimeCreatedErp",
    scopedSlots: { customRender: "DatetimeCreatedErp" },
    align: "center",
  },
  {
    title: "品号创建人",
    dataIndex: "UserNameCreatedErp",
    scopedSlots: { customRender: "UserNameCreatedErp" },
    align: "center",
  },
  {
    title: "品号修改时间",
    dataIndex: "DatetimeModifiedErp",
    scopedSlots: { customRender: "DatetimeModifiedErp" },
    align: "center",
  },
  {
    title: "品号修改人",
    dataIndex: "UserNameModifiedErp",
    scopedSlots: { customRender: "UserNameModifiedErp" },
    align: "center",
  },
  {
    title: "设计者",
    dataIndex: "UserNameDesigner",
    scopedSlots: { customRender: "UserNameDesigner" },
    align: "center",
  },
  {
    title: "发行时间",
    dataIndex: "DatetimeIssued",
    scopedSlots: { customRender: "DatetimeIssued" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];