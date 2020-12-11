import { Api, placeHolder } from '../base'
import { isDevelopmentEnv } from '@/utils/utils';

interface User {
    [propName: string]: Api
}
const user: User = {}

user.getUserInfos = {
    url: '/api/userinfos',
    method: 'GET',
}

user.searchUser = {
    url: '/api/userinfos/detail',
    method: 'GET',
}

user.queryCurrent = {
    url: '/api/users/current',
    method: 'GET',
}
// TODO 使用namespace来做

// TODO 定义类型的意义只是为了写代码时检查一下而已
// 情况1： 字段不多，不需要费那么多事，可以不定义类型
// 情况2： 字段很多，定义起来很费事，得不偿失
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
    dataModel: {
      loginName: 'string',
      password: 'string',
      mobile: 'string',
      jwtType: 'string',
      captcha: 'string',
    }
}

user.loginOut = {
    url: `/v2/passport/logout`,
    method: 'get',
    getResponse: isDevelopmentEnv(),
}
 
export default user;