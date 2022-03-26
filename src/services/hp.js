/*
 * @Author: max
 * @Date: 2022-03-26 10:33:17
 * @LastEditTime: 2022-03-26 15:34:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/hp.js
 */
import {
    UP_HP
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';


/**
 * @description: 折扣率
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getDiscountList(params) {
    return request(`${UP_HP}/getzkratelist`, METHOD.GET, params);
}

export function importDiscountList(params) {
    return request(`${UP_HP}/importzkrate`, METHOD.POST, params);
}