/*
 * @Author: max
 * @Date: 2021-07-14 08:51:07
 * @LastEditTime: 2021-07-21 16:40:31
 * @LastEditors: max
 * @Description: 后台接口
 * @FilePath: /up-admin/src/services/admin.js
 */
import {
	UP_ADMIN
} from '@/services/api'
import {
	request,
	METHOD
} from '@/utils/request'
/**
 * @description: 获取机构类型
 * @param {*} params
 * @return {*}
 */
export async function getInstitutionList(params) {
	return request(`${UP_ADMIN}/entertype/getlist`, METHOD.GET, params)
}

/**
 * @description: 添加机构类型
 * @param {*} params
 * @return {*}
 */
export async function addEnterType(params) {
	return request(`${UP_ADMIN}/entertype/add`, METHOD.POST, params)
}

/**
 * @description: 修改机构类型
 * @param {*} params
 * @return {*}
 */
export async function editEnterType(params) {
	return request(`${UP_ADMIN}/entertype/update`, METHOD.POST, params)
}

/**
 * @description: 删除机构类型
 * @param {*} params
 * @return {*}
 */
export async function delEnterType(params) {
	return request(`${UP_ADMIN}/entertype/delete`, METHOD.POST, params)
}

/**
 * @description: 获取机构列表
 * @param {*} params
 * @return {*}
 */
export async function getEnterList(params) {
	return request(`${UP_ADMIN}/enter/getlist`, METHOD.GET, params)
}
/**
 * @description: 获取机构列表
 * @param {*} params
 * @return {*}
 */
export async function addEnterList(params) {
	return request(`${UP_ADMIN}/enter/add`, METHOD.POST, params)
}
/**
 * @description: 更新机构列表
 * @param {*} params
 * @return {*}
 */
export async function updateEnterList(params) {
	return request(`${UP_ADMIN}/enter/update`, METHOD.POST, params)
}
/**
 * @description: 删除机构列表
 * @param {*} params
 * @return {*}
 */
export async function deleteEnterList(params) {
	return request(`${UP_ADMIN}/enter/delete`, METHOD.POST, params)
}

// 组织列表
/**
 * @description: 获取组织列表
 * @param {*} params
 * @return {*}
 */
export async function getOrganizationList(params) {
	return request(`${UP_ADMIN}/orgdimension/getall`, METHOD.GET, params)
}
/**
 * @description: 添加组织
 * @param {*} params
 * @return {*}
 */
export async function orgdimensionAction(params, action) {
	return request(`${UP_ADMIN}/orgdimension/${action}`, METHOD.POST, params)
}

// 组织等级
/**
 * @description: 获取组织等级
 * @param {*} params
 * @return {*}
 */
export async function getOrgLevelList(params) {
	return request(`${UP_ADMIN}/orglevel/getall`, METHOD.GET, params)
}
/**
 * @description: 组织等级
 * @param {*} params
 * @return {*}
 */
export async function orgLevelAction(params, action) {
	return request(`${UP_ADMIN}/orglevel/${action}`, METHOD.POST, params)
}

/**
 * @description:获取组织树形结构数据
 * @param {*} params
 * @return {*}
 */
export async function getEnterTree(params) {
	return request(`${UP_ADMIN}/enter/gettree`, METHOD.GET, params)
}

/**
 * @description:获取组织树形结构数据
 * @param {*} params
 * @return {*}
 */
export async function getOrginfo(params) {
	return request(`${UP_ADMIN}/orginfo/getall`, METHOD.GET, params)
}

/**
 * @description:获取组织树形结构数据
 * @param {*} params
 * @return {*}
 */
export async function orginfoAction(params,action) {
	return request(`${UP_ADMIN}/orginfo/${action}`, METHOD.POST, params)
}


/**
 * @description:获取用户列表
 * @param {*} params
 * @return {*}
 */
export async function getUserList(params) {
	return request(`${UP_ADMIN}/usertype/getall`, METHOD.GET, params)
}

/**
 * @description:用户操作
 * @param {*} params
 * @return {*}
 */
export async function userAction(params,action) {
	return request(`${UP_ADMIN}/usertype/${action}`, METHOD.POST, params)
}
export default {
	getInstitutionList,
	getEnterList,
	addEnterType,
	editEnterType,
	delEnterType,
	addEnterList,
	updateEnterList,
	deleteEnterList,
	getOrganizationList,
	orgdimensionAction,
	getOrgLevelList,
	orgLevelAction,
	getEnterTree,
	getOrginfo,
	orginfoAction,
	getUserList,
	userAction
}
