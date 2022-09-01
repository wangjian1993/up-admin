/*
 * @Author: max
 * @Date: 2022-08-10 16:38:42
 * @LastEditTime: 2022-08-25 10:17:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/srm.js
 */
import {
    UP_SRM
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
//采购收货管理
export function getPurchaseOrders(params, action) {
    return request(`${UP_SRM}/purchase/${action}`, METHOD.GET, params);
}
export function setPurchaseOrders(params, action) {
    return request(`${UP_SRM}/purchase/${action}`, METHOD.POST, params);
}

export function getPurchaseChange(params, action) {
    return request(`${UP_SRM}/purchasechange/${action}`, METHOD.GET, params);
}

export function getDelivery(params, action) {
    return request(`${UP_SRM}/delivery/${action}`, METHOD.GET, params);
}

export function getArrival(params, action) {
    return request(`${UP_SRM}/arrival/${action}`, METHOD.GET, params);
}

export function getReturn(params, action) {
    return request(`${UP_SRM}/return/${action}`, METHOD.GET, params);
}
//财务对账管理
export function getBill(params, action) {
    return request(`${UP_SRM}/bill/${action}`, METHOD.GET, params);
}

//供应商管理
export function getAuthentication(params, action) {
    return request(`${UP_SRM}/qua/${action}`, METHOD.GET, params);
}
export function getSupplierAction(params, action) {
    return request(`${UP_SRM}/supplier/${action}`, METHOD.GET, params);
}

//客户订单
export function getClientOrder(params, action) {
    return request(`${UP_SRM}/clientpurchase/${action}`, METHOD.GET, params);
}

export function getClientChange(params, action) {
    return request(`${UP_SRM}/clientpurchasechange/${action}`, METHOD.GET, params);
}

//送货单通知
export function getClientDelivery(params, action) {
    return request(`${UP_SRM}/clientdelivery/${action}`, METHOD.GET, params);
}
//客户退货
export function getClientReturn(params, action) {
    return request(`${UP_SRM}/clientreturn/${action}`, METHOD.GET, params);
}