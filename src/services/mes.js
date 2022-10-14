/*
 * @Author: max
 * @Date: 2022-08-29 16:34:37
 * @LastEditTime: 2022-10-13 15:07:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/mes.js
 */
import {
    UP_KANBAN,
    UP_WEB
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';
export function getOrderBi(params) {
    return request(`${UP_KANBAN}/mo/process/overall/getall/`, METHOD.GET, params);
}

export function getPowerPlant(params, action) {
    return request(`${UP_WEB}/powersupply/${action}`, METHOD.GET, params);
}
export function setPowerPlant(params, action) {
    return request(`${UP_WEB}/powersupply/${action}`, METHOD.POST, params);
}

export function getProcess(params, action) {
    return request(`${UP_WEB}/powersupply/process/${action}`, METHOD.GET, params);
}
export function setProcess(params, action) {
    return request(`${UP_WEB}/powersupply/process/${action}`, METHOD.POST, params);
}

export function getProcessLine(params, action) {
    return request(`${UP_WEB}/powersupply/process/line/${action}`, METHOD.GET, params);
}
export function setProcessLine(params, action) {
    return request(`${UP_WEB}/powersupply/process/line/${action}`, METHOD.POST, params);
}

export function getCraft(params, action) {
    return request(`${UP_WEB}/powersupply/process/routing/${action}`, METHOD.GET, params);
}
export function setCraft(params, action) {
    return request(`${UP_WEB}/powersupply/process/routing/${action}`, METHOD.POST, params);
}