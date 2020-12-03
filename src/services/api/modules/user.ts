import { Api, placeHolder } from '../index'
import { isDevelopmentEnv } from '@/utils/utils';

interface User {
    [propName: string]: Api
}
// todo  需要给data或params定义类型 
const user: User = {}

user.getUserInfos = {
    url: '/v1/userinfos',
    method: 'GET',
}

user.searchUser = {
    url: '/v1/userinfos/detail',
    method: 'GET',
}

user.queryCurrent = {
    url: '/v1/userinfos/current',
    method: 'GET',
}


export interface LoginParamsType {
    userName: string;
    password: string;
    mobile: string;
    captcha: string;
}
user.login = {
    url: '/v1/passport/login',
    method: 'POST',
    getResponse: isDevelopmentEnv(),
}

user.loginOut = {
    url: `/v1/passport/logout`,
    method: 'get',
    getResponse: isDevelopmentEnv(),
}
export default user;