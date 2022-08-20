/*
 * @Author: max
 * @Date: 2022-08-17 10:20:00
 * @LastEditTime: 2022-08-17 15:13:30
 * @LastEditors: max
 * @Description:
 * @FilePath: /up-admin/src/hiprint/design/panel.js
 */
const panel = {
  panels: [
    {
      'height': 148,//纸张的高
      'width': 210,//纸张的宽
      'paperHeader': 115,//页头的高度，调整高度可设置分页的页眉内容
      'paperFooter': 330,//页尾的高度，调整高度可设置分页的页尾内容
      'printElements': [{
        'options': { 'left': 262.5, 'top': 22.5, 'height': 9.75, 'width': 82.5, 'title': '送货单', 'fontSize': 19.5, 'fontWeight': 600, 'color': '#000' },
        'printElementType': { 'type': 'text' }
      }, {
        'options': { 'left': 19.5, 'top': 60, 'height': 9.75, 'width': 300, 'title': '供应商', 'field': 'supp', 'fontSize': 14, 'color': '#000' },
        'printElementType': { 'type': 'text' }
      }, {
        'options': { 'left': 300, 'top': 60, 'height': 9.75, 'width': 200, 'title': '单号', 'field': 'order', 'fontSize': 14, 'color': '#000' },
        'printElementType': { 'type': 'text' }
      }, {
        'options': { 'left': 19.5, 'top': 80, 'height': 9.75, 'width': 400, 'title': '地址', 'field': 'address', 'fontSize': 14, 'color': '#000' },
        'printElementType': { 'type': 'text' }
      }, {
        'options': { 'left': 19.5, 'top': 100, 'height': 9.75, 'width': 200, 'title': '送货日期', 'field': 'sendDate', 'fontSize': 14, 'color': '#000' },
        'printElementType': { 'type': 'text' }
      }, {
        'options': { 'left': 300, 'top': 100, 'height': 9.75, 'width': 200, 'title': '电话', 'field': 'tell', 'fontSize': 14, 'color': '#000' },
        'printElementType': { 'type': 'text' }
      }, {
        'options': { 'left': 470, 'top': 50, 'height': 60, 'width': 60, 'field': 'qrcode', 'textType': 'qrcode' },
        'printElementType': { 'type': 'text' }
      },
      //到这里为止是页眉的内容，下面是表格会自动分页
      {
        'options': {
          'left': 19.5,
          'top': 120,//表格高度
          'height': 39,
          'width': 549,
          'textAlign': 'center',
          'field': 'detailList',//表格数据
          'columns': [[//表格列
            { 'title': '序号', 'field': 'SHOWSERIAL', 'width': 28.675373869095594, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'SHOWSERIAL' },
            { 'title': '产品代码', 'field': 'PROD', 'width': 83.85182567889859, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'PROD' },
            { 'title': '品名', 'field': 'NAME', 'width': 109.20163436367484, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'NAME' },
            { 'title': '规格', 'field': 'SPEC', 'width': 54.34142950693378, 'colspan': 1, 'rowspan': 1, 'checked': true },
            { 'title': '送货数量', 'field': 'QTY', 'width': 44.082548951480675, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'QTY' },
            { 'title': '单位', 'field': 'UNITNAME', 'width': 43.366939065981505, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'UNITNAME' },
            { 'title': '含税单价', 'field': 'PRICETAX', 'width': 43.06711654562698, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'PRICETAX' },
            { 'title': '合计', 'field': 'ALL', 'width': 45.989780649905455, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'ALL' },
            { 'title': '备注', 'field': 'REMARK', 'width': 43.878609887169446, 'colspan': 1, 'rowspan': 1, 'checked': true, 'columnId': 'REMARK' }
          ]]
        },
        'printElementType': { 'title': '表格', 'type': 'tableCustom' }
      },
      { 'options': { 'left': 19.5, 'top': 330, 'height': 9.75, 'width': 270, 'title': '购货单位：金华有限公司', 'fontSize': 13, 'color': '#000' }, 'printElementType': { 'type': 'text' } },
      { 'options': { 'left': 220, 'top': 330, 'height': 9.75, 'width': 250, 'title': '地址：浙江省金华市', 'fontSize': 13, 'color': '#000' }, 'printElementType': { 'type': 'text' } },
      { 'options': { 'left': 450, 'top': 330, 'height': 9.75, 'width': 250, 'title': '电话：12345', 'fontSize': 13, 'color': '#000' }, 'printElementType': { 'type': 'text' } },
      {
        'options': { 'left': 19.5, 'top': 350, 'height': 9.75, 'width': 250, 'title': '购货单位签收:', 'fontSize': 13, 'color': '#000' }, 'printElementType': { 'title': '自定义文本', 'type': 'text' }
      }],
      'paperNumberLeft': 565.5,
      'paperNumberTop': 380,//页码位置
      'paperNumberFormat': 'paperNo/paperCount'
    }
  ]
}
export default panel

