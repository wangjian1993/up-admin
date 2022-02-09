/*
 * @Author: max
 * @Date: 2022-02-09 08:56:25
 * @LastEditTime: 2022-02-09 18:03:20
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