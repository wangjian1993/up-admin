/*
 * @Author: max
 * @Date: 2022-02-09 08:56:25
 * @LastEditTime: 2022-02-10 17:34:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/shipment.js
 */
import {
    UP_CMS
} from '@/services/api'
import {
    request,
    METHOD
} from '@/utils/request';

/**
 * @description: 生成部门配置
 * @param {*} params
 * @return {*}
 */

/** up */
//获取工厂
export function getPlantList(params) {
    return request(`${UP_CMS}/shipmentplantupshine/getplantlist`, METHOD.GET, params);
}
//获取订单数据
export function getOrderInfo(params) {
    return request(`${UP_CMS}/shipmentplantupshine/getorderinfo`, METHOD.GET, params);
}
//提交出货单
export function setShipment(params) {
    return request(`${UP_CMS}/shipmentplantupshine/addplant`, METHOD.POST, params);
}

//编辑出货单
export function editShipment(params) {
    return request(`${UP_CMS}/shipmentplantupshine/editplant`, METHOD.POST, params);
}

//提交出货单
export function getOrderList(params) {
    return request(`${UP_CMS}/shipmentplantupshine/getplanlist`, METHOD.GET, params);
}

//单个删除
export function deleteOrder(params) {
    return request(`${UP_CMS}/shipmentplantupshine/deleteplant`, METHOD.POST, params);
}

//处理
export function confirmShipment(params) {
    return request(`${UP_CMS}/shipmentplantupshine/confirmshipment`, METHOD.POST, params);
}

//出货
export function confirmDispose(params) {
    return request(`${UP_CMS}/shipmentplantupshine/handleplant`, METHOD.POST, params);
}


/** agc */
export function setShipmentAgc(params) {
    return request(`${UP_CMS}/shipmentplantagc/addoreditplant`, METHOD.POST, params);
}

export function getOrderInfoAgc(params,action) {
    return request(`${UP_CMS}/shipmentplantagc/${action}`, METHOD.GET, params);
}

export function deleteOrderAgc(params) {
    return request(`${UP_CMS}/shipmentplantagc/deleteplant`, METHOD.POST, params);
}
//出货
export function confirmShipmentAgc(params) {
    return request(`${UP_CMS}/shipmentplantagc/confirmshipment`, METHOD.POST, params);
}
//审核
export function confirmDisposeAgc(params) {
    return request(`${UP_CMS}/shipmentplantagc/checkplant`, METHOD.POST, params);
}