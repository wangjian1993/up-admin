/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2021-08-26 09:20:41
 * @LastEditors: max
 * @Description: 用户相关api
 * @FilePath: /up-admin/src/services/user.js
 */
import {request, METHOD, removeAuthorization} from '@/utils/request';
const userApi="http://192.168.1.245:6688/api/auth";
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(`${userApi}/user/uservalidate`, METHOD.POST, {
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
  return request(`${userApi}/user/update`, METHOD.POST,parmas);
}
/**
 * @description: 获取用户信息
 * @param {*}
 * @return {*}
 */
export async function getUserInfo() {
  return request(`${userApi}/user/getuser`, METHOD.POST);
}
/**
 * @description: 修改用户密码
 * @param {*}
 * @return {*}
 */
export async function changePwd(parmas) {
  return request(`${userApi}/user/changepwd`, METHOD.POST,parmas);
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
