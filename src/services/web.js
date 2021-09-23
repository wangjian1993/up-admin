/*
 * @Author: max
 * @Date: 2021-09-04 08:45:48
 * @LastEditTime: 2021-09-23 14:18:44
 * @LastEditors: max
 * @Description: 前端业务接口
 * @FilePath: /up-admin/src/services/web.js
 */
import {
    UP_WEB
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
export function getLineAll(params) {
    return request(`${UP_WEB}/line/getall`, METHOD.GET, params);
}
export function getLineList(params) {
    return request(`${UP_WEB}/line/getlist`, METHOD.GET, params);
}
export function lineAction(params, action) {
    return request(`${UP_WEB}/line/${action}`, METHOD.POST, params);
}
//获取车间
export function getWorkshopList(params) {
    return request(`${UP_WEB}/workshop/getlist`, METHOD.GET, params);
}
//添加车间j
export function addWorkshop(params) {
    return request(`${UP_WEB}/workshop/add`, METHOD.POST, params);
}
/**
 * @description: 获取需求公司
 * @param {*} params
 * @return {*}
 */
export function getDemandEnter(params) {
    return request(`${UP_WEB}/quote/getlistbytypecode`, METHOD.GET, params);
}

/**
 * @description: 报价配置项
 * @param {*} params
 * @return {*}
 */
export function getCostList(params) {
    return request(`${UP_WEB}/costbase/getcostbaselist`, METHOD.GET, params);
}
export function costAction(params, action) {
    return request(`${UP_WEB}/costbase/${action}`, METHOD.POST, params);
}

/**
 * @description: 新建报价
 * @param {*} params
 * @return {*}
 */
//获取器物料配置项
export function getCostConfig(params,action) {
    return request(`${UP_WEB}/quote/${action}`, METHOD.GET, params);
}
export function addCost(params,action) {
    return request(`${UP_WEB}/quote/${action}`, METHOD.POST, params);
}
/**
 * @description: 报价权限
 * @param {*} params
 * @return {*}
 */
export function getQuotePermission(params,action) {
    return request(`${UP_WEB}/quote/permission/${action}`, METHOD.GET, params);
}
export function quotePermissionAction(params,action) {
    return request(`${UP_WEB}/quote/permission/${action}`, METHOD.POST, params);
}

/**
 * @description: 导入物料需求计划
 * @param {*} params
 * @return {*}
 */

export function getMitemrequirement(params,action) {
    return request(`${UP_WEB}/mitemrequirement/${action}`, METHOD.GET, params);
}
export function mitemrequirementAction(params,action) {
    return request(`${UP_WEB}/mitemrequirement/${action}`, METHOD.POST, params);
}

/**
 * @description: 导入生产日计划
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getDailyPlan(params,action) {
    return request(`${UP_WEB}/dailyproductplan/${action}`, METHOD.GET, params);
}
export function dailyPlanAction(params,action) {
    return request(`${UP_WEB}/dailyproductplan/${action}`, METHOD.POST, params);
}


/**
 * @description: 供应链物料需求总计划
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getScmAction(params,action) {
    return request(`${UP_WEB}/scm/${action}`, METHOD.GET, params);
}
export function setScmAction(params,action) {
    return request(`${UP_WEB}/scm/${action}`, METHOD.POST, params);
}