/*
 * @Author: max
 * @Date: 2021-07-20 16:25:10
 * @LastEditTime: 2021-07-20 16:25:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/utils/bomRequest.JS
 */
// 导入axios
import axios from 'axios';
// 请求响应超时时间
axios.defaults.timeout = 5000;

// 封装自己的get/post方法
export default {
  get: function(path = '', data = {}) {
    return new Promise(function(resolve, reject) {
      axios.get(path, {
        params: data
      })
        .then(function(response) {
          // 按需求来，这里我需要的是response.data，所以返回response.data，一般直接返回response
          resolve(response.data);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  post: function(path = '', data = {}) {
    return new Promise(function(resolve, reject) {
      axios.post(path, data)
        .then(function(response) {
          resolve(response.data);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }
};
