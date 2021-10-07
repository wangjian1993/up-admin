/*
 * @Author: max
 * @Date: 2021-08-24 18:04:26
 * @LastEditTime: 2021-08-26 14:47:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/utils/setTableHeight.js
 */
export default function getTableScroll(extraHeight, id) {
  if (typeof extraHeight == "undefined") {
    //  默认底部分页64 + 边距10
    extraHeight = 70;
  }
  let tHeader = null;
  if (id) {
    tHeader = document.getElementById(id) ? document.getElementById(id).getElementsByClassName("ant-table-thead")[0] : null;
  } else {
    tHeader = document.getElementsByClassName("ant-table-thead")[0];
  }
  //表格内容距离顶部的距离
  // console.log("tHeader", tHeader);
  let tHeaderBottom = 0;
  if (tHeader) {
    tHeaderBottom = tHeader.getBoundingClientRect().bottom;
  }
  // console.log("tHeaderBottom", tHeader.getBoundingClientRect());
  //窗体高度-表格内容顶部的高度-表格内容底部的高度
  // let height = document.body.clientHeight - tHeaderBottom - extraHeight
  let height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`;
  // document.getElementsByClassName("ant-table")[0].style.maxHeight = `calc(100vh - ${tHeaderBottom}px)`;
  // document.getElementsByClassName("ant-table")[0].style.mixHeight = `calc(100vh - ${tHeaderBottom}px)`;
  return height;
}