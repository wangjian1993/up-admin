/*
 * @Author: max
 * @Date: 2022-08-29 16:34:37
 * @LastEditTime: 2022-10-28 17:16:46
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

export function getPeople(params, action) {
    return request(`${UP_WEB}/powersupply/production/dept/${action}`, METHOD.GET, params);
}
export function setPeople(params, action) {
    return request(`${UP_WEB}/powersupply/production/dept/${action}`, METHOD.POST, params);
}

export function getProcessReport(params, action) {
    return request(`${UP_WEB}/powersupply/process/report/${action}`, METHOD.POST, params);
}
export function getReleases(params, action) {
    return request(`${UP_WEB}/powersupply/process/report/${action}`, METHOD.GET, params);
}
export function setProcessReport(params, action) {
    return request(`${UP_WEB}/powersupply/process/report/${action}`, METHOD.POST, params);
}

export function getProcessAging(params, action) {
    return request(`${UP_WEB}/powersupply/process/ageing/${action}`, METHOD.POST, params);
}
export function getProcessAgingList(params, action) {
    return request(`${UP_WEB}/powersupply/process/ageing/${action}`, METHOD.GET, params);
}