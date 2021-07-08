/*
 * @Author: max
 * @Date: 2021-07-07 15:52:56
 * @LastEditTime: 2021-07-07 16:13:59
 * @LastEditors: max
 * @Description: 
 * @FilePath: /mb-admin/src/utils/axios.js
 */
// 导入axios
import axios from 'axios';
import qs from 'qs';

// 进行一些全局配置
// 公共路由(网络请求地址)
// axios.defaults.baseURL = 'http://localhost:8080/api';
// 请求响应超时时间
axios.defaults.timeout = 5000;

// 封装自己的get/post方法
export default {
    get: function (path = '', data = {}) {
        return new Promise(function (resolve, reject) {
            axios.get(path, {
                params: data
            })
                .then(function (response) {
                    // 按需求来，这里我需要的是response.data，所以返回response.data，一般直接返回response
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    },
    post: function (path = '', data = {}) {
        return new Promise(function (resolve, reject) {
            let params =qs.stringify(data);
            axios.post(path, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
            })
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
};