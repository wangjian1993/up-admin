/*
 * @Author: max
 * @Date: 2022-08-29 16:34:37
 * @LastEditTime: 2023-04-06 09:34:57
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/qms.js
 */
import {
    UP_QMS,
    UP_WMS,
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';

export function getIncomingTest(params, action) {
    return request(`${UP_QMS}/incoming/test/${action}`, METHOD.GET, params);
}
export function setIncomingTest(params, action) {
    return request(`${UP_QMS}/incoming/test/${action}`, METHOD.POST, params);
}
export function getTestItem(params, action) {
    return request(`${UP_QMS}/incoming/test/item/${action}`, METHOD.GET, params);
}
export function setTestItem(params, action) {
    return request(`${UP_QMS}/incoming/test/item/${action}`, METHOD.POST, params);
}
export function setDoList(params) {
    return request(`${UP_WMS}/purchasereceive/single`, METHOD.POST, params);
}
