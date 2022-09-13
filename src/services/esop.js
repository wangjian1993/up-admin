/*
 * @Author: max
 * @Date: 2022-03-28 11:04:11
 * @LastEditTime: 2022-09-13 10:50:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/esop.js
 */
import {
    UP_ESOP,
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

export function setRecordApi(params, action) {
    return request(`${UP_ESOP}/doc/record/${action}`, METHOD.POST, params);
}

export function publishInfo(params) {
    return request(`${UP_ESOP}/client/mqtt/publishbyid`, METHOD.POST, params);
}

export function getPushRecord(params, action) {
    return request(`${UP_ESOP}/client/${action}`, METHOD.GET, params);
}

export function setPushRecord(params, action) {
    return request(`${UP_ESOP}/client/${action}`, METHOD.POST, params);
}
//客诉列表
export function getComplaint(params, action) {
    return request(`${UP_ESOP}/repository/${action}`, METHOD.GET, params);
}

export function setComplaint(params, action) {
    return request(`${UP_ESOP}/repository/${action}`, METHOD.POST, params);
}

export function getInspection(params, action) {
    return request(`${UP_ESOP}/inspection/${action}`, METHOD.GET, params);
}

export function setInspection(params, action) {
    return request(`${UP_ESOP}/inspection/${action}`, METHOD.POST, params);
}