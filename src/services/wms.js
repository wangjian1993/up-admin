/*
 * @Author: max
 * @Date: 2022-03-03 08:56:32
 * @LastEditTime: 2023-04-25 10:14:37
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

export function getTestData(params) {
    return request(`${UP_WMS}/purchasereceive/test/get`, METHOD.GET, params);
}
export function setTestData(params, action) {
    return request(`${UP_WMS}/purchasereceive/test/${action}`, METHOD.POST, params);
}