/*
 * @Author: max
 * @Date: 2022-03-28 11:04:11
 * @LastEditTime: 2022-04-06 15:45:52
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
 * @description: 文档管理
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getSopDocument(params, action) {
    return request(`${UP_ESOP}/doc/${action}`, METHOD.GET, params);
}

export function setSopDocumnet(params, action) {
    return request(`${UP_ESOP}/doc/${action}`, METHOD.POST, params);
}
/**
 * @description: 设备管理
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getSopDevice(params, action) {
    return request(`${UP_ESOP}/equipment/${action}`, METHOD.GET, params);
}

export function setSopDevice(params, action) {
    return request(`${UP_ESOP}/equipment/${action}`, METHOD.POST, params);
}
export function getDeviceList(params, action) {
    return request(`${UP_ESOP}/doc/equipment/${action}`, METHOD.GET, params);
}

export function deviceSopBind(params, action) {
    return request(`${UP_ESOP}/doc/equipment/${action}`, METHOD.POST, params);
}

export function getProduct(params, action) {
    return request(`${UP_ESOP}/product/${action}`, METHOD.GET, params);
}

export function setProduct(params, action) {
    return request(`${UP_ESOP}/product/${action}`, METHOD.POST, params);
}