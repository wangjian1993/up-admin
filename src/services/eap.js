/*
 * @Author: max
 * @Date: 2022-04-29 17:37:25
 * @LastEditTime: 2022-05-09 13:39:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/eap.js
 */
import {
    UP_EAP,
    UP_MQTT
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
export function getMqttServiceAction(params, action) {
    return request(`${UP_MQTT}/server/${action}`, METHOD.GET, params);
}
export function setMqttServiceAction(params, action) {
    return request(`${UP_MQTT}/server/${action}`, METHOD.POST, params);
}
export function getMqttClientAction(params, action) {
    return request(`${UP_MQTT}/client/${action}`, METHOD.GET, params);
}
export function setMqttClientAction(params, action) {
    return request(`${UP_MQTT}/client/${action}`, METHOD.POST, params);
}
export function getPlcAction(params, action) {
    return request(`${UP_EAP}/plc/${action}`, METHOD.GET, params);
}
export function setPlcAction(params, action) {
    return request(`${UP_EAP}/plc/${action}`, METHOD.POST, params);
}