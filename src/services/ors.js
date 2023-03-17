/*
 * @Author: max
 * @Date: 2022-08-29 16:34:37
 * @LastEditTime: 2023-03-17 13:48:09
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/ors.js
 */
import {
    UP_ORS,
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';

export function getOrderAddress(params, action) {
    return request(`${UP_ORS}/address/${action}`, METHOD.GET, params);
}
export function setOrderAddress(params, action) {
    return request(`${UP_ORS}/address/${action}`, METHOD.POST, params);
}

export function getGoodsClassify(params, action) {
    return request(`${UP_ORS}/goods/classify/${action}`, METHOD.GET, params);
}
export function setGoodsClassify(params, action) {
    return request(`${UP_ORS}/goods/classify/${action}`, METHOD.POST, params);
}

export function getGoods(params, action) {
    return request(`${UP_ORS}/goods/${action}`, METHOD.GET, params);
}
export function setGoods(params, action) {
    return request(`${UP_ORS}/goods/${action}`, METHOD.POST, params);
}