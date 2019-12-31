import request from '@/utils/request';
// import axios from 'axios';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
  // const ressss = await request('/v1/passport/login', {
  //   method: 'POST',
  //   data: params,
  //   getResponse: true,
  // });
  //
  // console.log(ressss, 'ressssressss');
  return request('/v1/passport/login', {
    method: 'POST',
    data: params,
    // getResponse: true,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
