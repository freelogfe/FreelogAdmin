import request from '@/utils/request';
import {createClient} from '@/utils/request';

import { Api, placeHolder } from './api'
import apis from './api'
import { compareObjects } from '@/utils/utils'

/**
 * 
 * @param action api namespace.apiName
 * @param urlData array, use item for replace url's placeholder 
 * @param data  body data or query data  string | object | Array<any> | null | JSON | undefined
 */
export default function frequest(action: string, urlData: Array<string | number>, data: any ): any {
    if (action.indexOf('.') === -1 || !action) {
        console.error('action is not exists: ' + action)
        return
    }
    let arr = action.split('.')
    if (!apis[arr[0].toLowerCase()] || !apis[arr[0].toLowerCase()][arr[1]]) {
        console.error('action is not exists: ' + action)
        return
    }
    let api: Api = Object.assign({},apis[arr[0].toLowerCase()][arr[1]])
    // type Api2 = Exclude<Api, 'url' | 'before' | 'after'>
    let url = api.url
    if (url.indexOf(placeHolder) > -1) {
        if (!urlData.length) {
            console.error('urlData is required: ' + urlData)
            return
        }
        urlData.forEach((item)=>{
            url = url.replace(placeHolder, item + '')
        })
    }
    // filter data if there are dataModel
    if(api.dataModel){
        compareObjects(api.dataModel, data, !!api.isDiff)  
        console.log(data)
    }
    // pre method
    if(api.before){
        data = api.before(data) || data
    } 
    if(api.method.toLowerCase() === 'get'){
        api.params = data
    }else{
        api.data = data
    }
    ;['url', 'before', 'after'].forEach((item) => {
        delete api[item]
    })
    let req = request
    // after method: create a new request
    if(api.after){
        req = createClient()
        request.interceptors.response.use((response, options) => {
           api.after && api.after(response)
           return response;
        });
    }
    let _api: object = Object.assign({}, api)
    return req(url, _api)
}