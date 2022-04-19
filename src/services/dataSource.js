/*
 * @Author: max
 * @Date: 2022-04-19 09:48:27
 * @LastEditTime: 2022-04-19 09:48:28
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/dataSource.js
 */
import {GOODS, GOODS_COLUMNS} from './api'
import {METHOD, request} from '@/utils/request'

export async function goodsList(params) {
  return request(GOODS, METHOD.GET, params)
}

export async function goodsColumns() {
  return request(GOODS_COLUMNS, METHOD.GET)
}

export default {goodsList, goodsColumns}