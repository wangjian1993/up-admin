/*
 * @Author: max
 * @Date: 2022-03-28 11:04:11
 * @LastEditTime: 2022-03-28 11:56:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/esop.js
 */
import {
    UP_ESOP
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
export function getSopDevice(params,action) {
    return request(`${UP_ESOP}/equipment/${action}`, METHOD.GET, params);
}

export function setSopDevice(params,action) {
    return request(`${UP_ESOP}/equipment/${action}`, METHOD.POST, params);
}