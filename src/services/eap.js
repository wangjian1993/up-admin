/*
 * @Author: max
 * @Date: 2022-04-29 17:37:25
 * @LastEditTime: 2022-05-05 13:39:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/eap.js
 */
import {
    UP_EAP
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';


/**
 * @description: 车间
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getPlantList(params, action) {
    return request(`${UP_EAP}/line/${action}`, METHOD.GET, params);
}
export function getWorkshopAction(params, action) {
    return request(`${UP_EAP}/workshop/${action}`, METHOD.GET, params);
}
export function setWorkshopAction(params, action) {
    return request(`${UP_EAP}/workshop/${action}`, METHOD.POST, params);
}

export function getLineAction(params, action) {
    return request(`${UP_EAP}/line/${action}`, METHOD.GET, params);
}
export function setLineAction(params, action) {
    return request(`${UP_EAP}/line/${action}`, METHOD.POST, params);
}

export function getWorkstationAction(params, action) {
    return request(`${UP_EAP}/workstation/${action}`, METHOD.GET, params);
}
export function setWorkstationAction(params, action) {
    return request(`${UP_EAP}/workstation/${action}`, METHOD.POST, params);
}
export function getDeviceTypeAction(params, action) {
    return request(`${UP_EAP}/equiment/type/${action}`, METHOD.GET, params);
}
export function setDeviceTypeAction(params, action) {
    return request(`${UP_EAP}/equiment/type/${action}`, METHOD.POST, params);
}
export function getDeviceAction(params, action) {
    return request(`${UP_EAP}/equiment/${action}`, METHOD.GET, params);
}
export function setDeviceAction(params, action) {
    return request(`${UP_EAP}/equiment/${action}`, METHOD.POST, params);
}