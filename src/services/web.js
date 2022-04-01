/*
 * @Author: max
 * @Date: 2021-09-04 08:45:48
 * @LastEditTime: 2022-04-01 17:49:29
 * @LastEditors: max
 * @Description: 前端业务接口
 * @FilePath: /up-admin/src/services/web.js
 */
import {
    UP_WEB,
    UP_REPORT
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
export function getCostConfig(params, action) {
    return request(`${UP_WEB}/quote/${action}`, METHOD.GET, params);
}
export function addCost(params, action) {
    return request(`${UP_WEB}/quote/${action}`, METHOD.POST, params);
}
/**
 * @description: 报价权限
 * @param {*} params
 * @return {*}
 */
export function getQuotePermission(params, action) {
    return request(`${UP_WEB}/quote/permission/${action}`, METHOD.GET, params);
}
export function quotePermissionAction(params, action) {
    return request(`${UP_WEB}/quote/permission/${action}`, METHOD.POST, params);
}

/**
 * @description: 导入物料需求计划
 * @param {*} params
 * @return {*}
 */

export function getMitemrequirement(params, action) {
    return request(`${UP_WEB}/mitemrequirement/${action}`, METHOD.GET, params);
}
export function mitemrequirementAction(params, action) {
    return request(`${UP_WEB}/mitemrequirement/${action}`, METHOD.POST, params);
}

/**
 * @description: 导入生产日计划
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getDailyPlan(params, action) {
    return request(`${UP_WEB}/dailyproductplan/${action}`, METHOD.GET, params);
}
export function dailyPlanAction(params, action) {
    return request(`${UP_WEB}/dailyproductplan/${action}`, METHOD.POST, params);
}


/**
 * @description: 供应链物料需求总计划
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getScmAction(params, action) {
    return request(`${UP_WEB}/scm/${action}`, METHOD.GET, params);
}
export function setScmAction(params, action) {
    return request(`${UP_WEB}/scm/${action}`, METHOD.POST, params);
}

/**
 * @description: 供应商回复
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getSupplierAction(params, action) {
    return request(`${UP_WEB}/scm/supplier/${action}`, METHOD.GET, params);
}
export function setSupplierAction(params, action) {
    return request(`${UP_WEB}/scm/supplier/${action}`, METHOD.POST, params);
}
/**
 * @description: 采购质检
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getQualityAction(params, action) {
    return request(`${UP_WEB}/purchase/qt/${action}`, METHOD.GET, params);
}
export function setQualityAction(params, action) {
    return request(`${UP_WEB}/purchase/qt/${action}`, METHOD.POST, params);
}

/**
 * @description: 采购质检
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getBuyerAction(params, action) {
    return request(`${UP_WEB}/purchase/reset/${action}`, METHOD.GET, params);
}
export function setBuyerAction(params, action) {
    return request(`${UP_WEB}/purchase/reset/${action}`, METHOD.POST, params);
}

/**
 * @description: 物料输出计划
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getMitemPlanAction(params, action) {
    return request(`${UP_WEB}/mitemplan/${action}`, METHOD.GET, params);
}
export function setMitemPlanAction(params, action) {
    return request(`${UP_WEB}/mitemplan/${action}`, METHOD.POST, params);
}

/**
 * @description: 产线生产日计划
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export function getDailyPlanAction(params, action) {
    return request(`${UP_WEB}/production/dailyplan/${action}`, METHOD.GET, params);
}
export function getPrintInfo(params, action) {
    return request(`${UP_WEB}/production/print/${action}`, METHOD.GET, params);
}
export function setPrintInfo(params, action) {
    return request(`${UP_WEB}/production/print/${action}`, METHOD.POST, params);
}
export function setDailyPlanAction(params, action) {
    return request(`${UP_WEB}/production/dailyplan/${action}`, METHOD.POST, params);
}
//生产人员配置
export function getProductionPersonnel(params, action) {
    return request(`${UP_WEB}/production/dept/${action}`, METHOD.GET, params);
}
export function setProductionPersonnel(params, action) {
    return request(`${UP_WEB}/production/dept/${action}`, METHOD.POST, params);
}
//工序产线配置
export function getProcessLine(params, action) {
    return request(`${UP_WEB}/process/${action}`, METHOD.GET, params);
}
export function setProcessLine(params, action) {
    return request(`${UP_WEB}/process/${action}`, METHOD.POST, params);
}
//订单管理
export function getOrderApi(params, action) {
    return request(`${UP_WEB}/trace/order/${action}`, METHOD.GET, params);
}
export function setOrderApi(params, action) {
    return request(`${UP_WEB}/trace/order/${action}`, METHOD.POST, params);
}
//订单预处理管理
export function getPreporcessApi(params, action) {
    return request(`${UP_WEB}/preporcess/order/${action}`, METHOD.GET, params);
}
export function setPreporcessApi(params, action) {
    return request(`${UP_WEB}/preporcess/order/${action}`, METHOD.POST, params);
}
//开工
export function getStartWorkApi(params, action) {
    return request(`${UP_WEB}/process/report/${action}`, METHOD.GET, params);
}
export function setStartWorkApi(params, action) {
    return request(`${UP_WEB}/process/report/${action}`, METHOD.POST, params);
}
//返工
export function getReworkApi(params, action) {
    return request(`${UP_WEB}/process/rework/${action}`, METHOD.GET, params);
}
export function setReworkApi(params, action) {
    return request(`${UP_WEB}/process/rework/${action}`, METHOD.POST, params);
}
//老化
export function getAgeingApi(params, action) {
    return request(`${UP_WEB}/process/ageing/${action}`, METHOD.GET, params);
}
export function setAgeingApi(params, action) {
    return request(`${UP_WEB}/process/ageing/${action}`, METHOD.POST, params);
}

export function getDailyReport(params, action) {
    return request(`${UP_REPORT}/production/${action}`, METHOD.GET, params);
}