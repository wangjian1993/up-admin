/*
 * @Author: max
 * @Date: 2021-04-04 10:20:48
 * @LastEditTime: 2021-08-31 16:54:34
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/process/components/ConfigPanel/ConfigNode/method.js
 */
import FlowGraph from '../../../graph/index'

export function nodeOpt (id, globalGridAttr) {
  let curCel = null
  if (id) {
    const { graph } = FlowGraph
    const cell = graph.getCellById(id)
    if (!cell || !cell.isNode()) {
      return
    }
    curCel = cell
    globalGridAttr.nodeStroke = cell.attr('body/stroke')
    globalGridAttr.nodeStrokeWidth = cell.attr('body/strokeWidth')
    globalGridAttr.nodeFill = cell.attr('body/fill')
    globalGridAttr.nodeFontSize = cell.attr('text/fontSize')
    globalGridAttr.nodeColor = cell.attr('text/fill')
    globalGridAttr.nodeUsers = cell.attr('approve/users')
    globalGridAttr.nodeUrl = cell.attr('item/url')
  }
  return curCel
}
