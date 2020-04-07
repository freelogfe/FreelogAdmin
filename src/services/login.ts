import request from '@/utils/request';
import { isDevelopmentEnv } from '@/utils/utils';
// import axios from 'axios';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/v1/passport/login', {
    method: 'POST',
    data: params,
    getResponse: isDevelopmentEnv(),
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
