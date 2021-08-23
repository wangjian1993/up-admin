/*
 * @Author: max
 * @Date: 2021-07-14 08:51:07
 * @LastEditTime: 2021-08-23 11:13:05
 * @LastEditors: max
 * @Description: 后台接口
 * @FilePath: /up-admin/src/services/admin.js
 */
import {
	UP_ADMIN
} from '@/services/api';
import {
	request,
	METHOD
} from '@/utils/request';
/**
 * @description: 获取机构类型
 * @param {*} params
 * @return {*}
 */
export async function getInstitutionList(params) {
	return request(`${UP_ADMIN}/entertype/getlist`, METHOD.GET, params);
}
export async function addEnterType(params) {
	return request(`${UP_ADMIN}/entertype/add`, METHOD.POST, params);
}
export async function editEnterType(params) {
	return request(`${UP_ADMIN}/entertype/update`, METHOD.POST, params);
}
export async function delEnterType(params) {
	return request(`${UP_ADMIN}/entertype/delete`, METHOD.POST, params);
}

/**
 * @description: 获取机构列表
 * @param {*} params
 * @return {*}
 */
export async function getEnterList(params) {
	return request(`${UP_ADMIN}/enter/getlist`, METHOD.GET, params);
}
export async function addEnterList(params) {
	return request(`${UP_ADMIN}/enter/add`, METHOD.POST, params);
}
export async function updateEnterList(params) {
	return request(`${UP_ADMIN}/enter/update`, METHOD.POST, params);
}
export async function deleteEnterList(params) {
	return request(`${UP_ADMIN}/enter/delete`, METHOD.POST, params);
}

// 组织列表
/**
 * @description: 获取组织列表
 * @param {*} params
 * @return {*}
 */
export async function getOrganizationList(params) {
	return request(`${UP_ADMIN}/orgdimension/getall`, METHOD.GET, params);
}
export async function orgdimensionAction(params, action) {
	return request(`${UP_ADMIN}/orgdimension/${action}`, METHOD.POST, params);
}

// 组织等级
/**
 * @description: 获取组织等级
 * @param {*} params
 * @return {*}
 */
export async function getOrgLevelList(params) {
	return request(`${UP_ADMIN}/orglevel/getall`, METHOD.GET, params);
}
export async function orgLevelAction(params, action) {
	return request(`${UP_ADMIN}/orglevel/${action}`, METHOD.POST, params);
}

/**
 * @description:获取组织树形结构数据
 * @param {*} params
 * @return {*}
 */
export async function getEnterTree(params) {
	return request(`${UP_ADMIN}/enter/gettree`, METHOD.GET, params);
}

/**
 * @description:获取组织树形结构数据
 * @param {*} params
 * @return {*}
 */
export async function getOrginfo(params) {
	return request(`${UP_ADMIN}/orginfo/getall`, METHOD.GET, params);
}
export async function orginfoAction(params, action) {
	return request(`${UP_ADMIN}/orginfo/${action}`, METHOD.POST, params);
}
export async function getOrgUser(params) {
	return request(`${UP_ADMIN}/orginfo/getusers`, METHOD.GET, params);
}
export async function addOrgUser(params) {
	return request(`${UP_ADMIN}/orginfo/adduser`, METHOD.POST, params);
}
export async function delOrgUser(params) {
	return request(`${UP_ADMIN}/orginfo/removeuser`, METHOD.POST, params);
}

/**
 * @description:获取用户列表
 * @param {*} params
 * @return {*}
 */
export async function getUserTypeList(params) {
	return request(`${UP_ADMIN}/usertype/getall`, METHOD.GET, params);
}
export async function userTypeAction(params, action) {
	return request(`${UP_ADMIN}/usertype/${action}`, METHOD.POST, params);
}


/**
 * @description:用户列表
 * @param {*} params
 * @return {*}
 */
export async function getUserList(params) {
	return request(`${UP_ADMIN}/user/getall`, METHOD.GET, params);
}
export async function getUserRoles(params) {
	return request(`${UP_ADMIN}/user/getroles`, METHOD.GET, params);
}
export async function userAction(params, action) {
	return request(`${UP_ADMIN}/user/${action}`, METHOD.POST, params);
}

/**
 * @description:应用管理
 * @param {*} params
 * @return {*}
 */
export async function getAppTypeList(params) {
	return request(`${UP_ADMIN}/apptype/getall`, METHOD.GET, params);
}
export async function appTypeAction(params, action) {
	return request(`${UP_ADMIN}/apptype/${action}`, METHOD.POST, params);
}

/**
 * @description:应用列表
 * @param {*} params
 * @return {*}
 */
export async function getAppInfoList(params) {
	return request(`${UP_ADMIN}/appinfo/getall`, METHOD.GET, params);
}
export async function appInfoAction(params, action) {
	return request(`${UP_ADMIN}/appinfo/${action}`, METHOD.POST, params);
}

/**
 * @description:应用列表
 * @param {*} params
 * @return {*}
 */
export async function uploadFile(params) {
	return request(`${UP_ADMIN}/upload/img`, METHOD.POST, params);
}

/**
 * @description:菜单管理
 * @param {*} params
 * @return {*}
 */
export async function getMenuList(params) {
	return request(`${UP_ADMIN}/module/getall`, METHOD.GET, params);
}
export async function menuAction(params, action) {
	return request(`${UP_ADMIN}/module/${action}`, METHOD.POST, params);
}


/**
 * @description:权限-查询组织树状信息API
 * @param {*} params
 * @return {*}
 */
export async function getOrgTree(params) {
	return request(`${UP_ADMIN}/orginfo/getorgtree`, METHOD.GET, params);
}
/**
 * @description:权限-查询应用菜单树形信息API
 * @param {*} params
 * @return {*}
 */
export async function getAppMdules(params) {
	return request(`${UP_ADMIN}/permission/getmodules`, METHOD.GET, params);
}

/**
 * @description:权限-查询应用菜单树形信息API
 * @param {*} params
 * @return {*}
 */
export async function setPermission(params, action) {
	return request(`${UP_ADMIN}/permission/${action}`, METHOD.POST, params);
}
/**
 * @description:权限-查询应用菜单树形信息API
 * @param {*} params
 * @return {*}
 */
export async function getPermissionList(params) {
	return request(`${UP_ADMIN}/permission/getdatapermission`, METHOD.GET, params);
}
/**
 * @description:数据字典-快码组管理
 * @param {*} params
 * @return {*}
 */
export async function getParamGroupList(params) {
	return request(`${UP_ADMIN}/paramgroup/getall`, METHOD.GET, params);
}
export async function paramGroupAction(params, action) {
	return request(`${UP_ADMIN}/paramgroup/${action}`, METHOD.POST, params);
}
/**
 * @description:数据字典-快码管理
 * @param {*} params
 * @return {*}
 */
export async function getParamList(params) {
	return request(`${UP_ADMIN}/param/getall`, METHOD.GET, params);
}
export async function paramAction(params, action) {
	return request(`${UP_ADMIN}/param/${action}`, METHOD.POST, params);
}
export async function getParamData(params) {
	return request(`${UP_ADMIN}/param/getlist`, METHOD.GET, params);
}

/**
 * @description:权限管理-新
 * @param {*} params
 * @return {*}
 */
export async function getEnterOrgList() {
	return request(`${UP_ADMIN}/permission/geteotypes`, METHOD.GET);
}
export async function getPermissionUser(params) {
	return request(`${UP_ADMIN}/permission/getusers`, METHOD.GET, params);
}
export async function getEnterOrgTree(params) {
	return request(`${UP_ADMIN}/permission/getenterorgs`, METHOD.GET, params);
}


/**
 * @description: 日志列表
 * @param {*} params
 * @param {*} action
 * @return {*}
 */
export async function getLogAction(params,action) {
	return request(`${UP_ADMIN}/log/${action}`, METHOD.GET, params);
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
	getUserTypeList,
	userTypeAction,
	userAction,
	getUserRoles,
	getAppTypeList,
	appTypeAction,
	getUserList,
	getAppInfoList,
	appInfoAction,
	getOrgUser,
	addOrgUser,
	delOrgUser,
	uploadFile,
	getMenuList,
	menuAction,
	getOrgTree,
	getAppMdules,
	getPermissionList,
	getParamGroupList,
	paramGroupAction,
	setPermission,
	getParamList,
	paramAction,
	getParamData,
	getEnterOrgList,
	getPermissionUser,
	getEnterOrgTree,
	getLogAction
};
