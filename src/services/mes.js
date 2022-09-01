/*
 * @Author: max
 * @Date: 2022-08-29 16:34:37
 * @LastEditTime: 2022-08-29 16:37:07
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/mes.js
 */
import {
    UP_KANBAN
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';
export function getOrderBi(params) {
    return request(`${UP_KANBAN}/mo/process/overall/getall/`, METHOD.GET, params);
}