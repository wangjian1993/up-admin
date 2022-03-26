/*
 * @Author: max
 * @Date: 2022-03-26 10:33:17
 * @LastEditTime: 2022-03-26 10:37:24
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
 * @description: erp报表查询
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
 export function getDiscountList(params) {
    return request(`${UP_HP}/getzkratelist`, METHOD.GET, params);
}