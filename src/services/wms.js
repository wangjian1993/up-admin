/*
 * @Author: max
 * @Date: 2022-03-03 08:56:32
 * @LastEditTime: 2022-03-03 09:36:33
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/wms.js
 */
import {
    UP_WMS
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';
export function getPlanList(params) {
    return request(`${UP_WMS}/plan/getall`, METHOD.GET, params);
}

export function setPlan(params) {
    return request(`${UP_WMS}/plan/publish`, METHOD.POST, params);
}