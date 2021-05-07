import request from '@/utils/request';
import { createClient } from '@/utils/request';

import { Api, placeHolder } from './api/base'
import apis from './api'
import { compareObjects } from '@/utils/utils'
import { message } from 'antd';

export interface MessageInfo {
    success: string;
    fail: string;
}
let { REACT_APP_ENV } = process.env;
if(window.location.href.indexOf('freelog') === -1){
    REACT_APP_ENV = 'dev'
}
let baseURL = 'http://qi.testfreelog.com/'
if (window.location.href.indexOf('testfreelog') === -1) {
    baseURL = 'http://qi.freelog.com/'
}
/**
 * 
 * @param action api namespace.apiName
 * @param urlData array, use item for replace url's placeholder 
 * @param data  body data or query data  string | object | Array<any> | null | JSON | undefined
 */
export default function frequest(action: string, urlData: Array<string | number>, data: any, messageData?: MessageInfo): any {
    if (action.indexOf('.') === -1 || !action) {
        console.error('action is not exists: ' + action)
        return
    }
    let arr = action.split('.')
    if (!apis[arr[0].toLowerCase()] || !apis[arr[0].toLowerCase()][arr[1]]) {
        console.error('action is not exists: ' + action)
        return
    }
    let api: Api = Object.assign({}, apis[arr[0].toLowerCase()][arr[1]])
    // type Api2 = Exclude<Api, 'url' | 'before' | 'after'>
    let url = api.url
    if (url.indexOf(placeHolder) > -1) {
        if (!urlData.length) {
            console.error('urlData is required: ' + urlData)
            return
        }
        urlData.forEach((item) => {
            url = url.replace(placeHolder, item + '')
        })
    }
    if(REACT_APP_ENV !== 'dev'){
        if(url.startsWith('/api')){
            url = baseURL + 'v2/' +   url.substring(5)
            console.log(url)
        } else {
            url = baseURL + url
        } 
    }
    
    // filter data if there is dataModel
    if (api.dataModel) {
        // TODO 需要用deepclone
        data = Object.assign({}, data)
        compareObjects(api.dataModel, data, !!api.isDiff)
    }
    // pre method
    if (api.before) {
        data = api.before(data) || data
    }
    if (api.method.toLowerCase() === 'get') {
        api.params = data
    } else {
        api.data = data
    }
    // delete extra keys
    ;['url', 'before', 'after'].forEach((item) => {
        delete api[item]
    })
    let _api: object = Object.assign({}, api)
    // show msg
    return new Promise((resolve: any, reject: any) => {
        request(url, _api).then(async (response) => {
            api.after && api.after(response)
            if (messageData) {
                if (response.errcode === 0) {
                    const msg = messageData.success === 'msg' ? response.msg : messageData.success;
                    msg && message.success(msg)
                } else {
                    const msg = messageData.fail === 'msg' ? response.msg : messageData.fail;
                    msg && message.warn(msg)
                }
            }
            resolve(response)
        }).catch((error) => {
            // 防止error为空
            reject({error})
            if(typeof error === 'string'){
                message.error(error)
            }else{
                message.error('请求失败！')
            }
        })
    })
}