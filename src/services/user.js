/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2021-09-28 14:51:03
 * @LastEditors: max
 * @Description: 用户相关api
 * @FilePath: /up-admin/src/services/user.js
 */
import {request, METHOD, removeAuthorization} from '@/utils/request';
import {UP_USER} from './api'
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(`${UP_USER}/user/uservalidate`, METHOD.POST, {
    userName: name,
    userPwd: password
  },false);
}

/**
 * @description: 更新用户信息
 * @param {*} parmas
 * @return {*}
 */
export async function loginUpdate(parmas) {
  return request(`${UP_USER}/user/update`, METHOD.POST,parmas);
}
/**
 * @description: 获取用户信息
 * @param {*}
 * @return {*}
 */
export async function getUserInfo() {
  return request(`${UP_USER}/user/getuser`, METHOD.POST);
}
/**
 * @description: 修改用户密码
 * @param {*}
 * @return {*}
 */
export async function changePwd(parmas) {
  return request(`${UP_USER}/user/changepwd`, METHOD.POST,parmas);
}
/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY);
  removeAuthorization();
}
export default {
  login,
  logout,
  getUserInfo,
  loginUpdate,
  changePwd
};
