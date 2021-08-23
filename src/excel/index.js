/*
 * @Author: max
 * @Date: 2021-08-23 09:12:58
 * @LastEditTime: 2021-08-23 09:13:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/excel/index.js
 */
import XLSX from 'xlsx';
/**
 * @function 生成表格的方法
 * @param {String} excelName 文件名
 * @param {Array} titleArr 数据表头显示
 * @param {Array} dataArr 数据内容显示
 */
 const ToDoExcel = (excelName, titleArr, dataArr) => {
  var filename = excelName + ".xlsx" //文件名称
  var data = [titleArr, ...dataArr]  //数据，一定注意需要时二维数组
  var ws_name = "Sheet1" //Excel第一个sheet的名称
  var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, ws_name)  //将数据添加到工作薄
  XLSX.writeFile(wb, filename)
}
export default ToDoExcel;