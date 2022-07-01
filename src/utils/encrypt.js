/* eslint-disable */
import CryptoJS from 'crypto-js'

const CRYPTO_SECRET = '71670043107552275637938241633858'

/**
 * AES加密数据
 * @param data 需要加密的数据
 * @returns 返回AES加密后的数据
 */
export function encrypto(data) {
    const newData = JSON.stringify(data)
    return CryptoJS.AES.encrypt(newData, CRYPTO_SECRET).toString()
}

/**
 * AES解密数据
 * @param encryptedData 加密后的数据
 * @returns 解密的数据
 */
export function decrypto(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, CRYPTO_SECRET);
    const originText = bytes.toString(CryptoJS.enc.Utf8)
    if (originText) {
        return JSON.parse(originText);
    }
    return '解密失败'
}

