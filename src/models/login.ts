import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import router from 'umi/router';

import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
// import {setAuthority} from '@/utils/authority';
import { getPageQuery, isDevelopmentEnv } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    * login({ payload }, { call, put }) {
      // console.log(payload, 'payload');
      // const rrr = yield fakeAccountLogin(payload);
      // console.log(rrr.response.headers, 'rrr')
      const { response, data } = yield call(fakeAccountLogin, payload);
      // console.log(response.headers.get('authorization'), 'responseresponse');
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // });
      // Login successfully
      // console.log(response, data, 'datadatadatadata');
      if (response === undefined || (data.errcode === 0 && data.ret === 0)) {
        // window.localStorage.setItem('authorization', '');
        if (isDevelopmentEnv()) {
          window.document.cookie = `authInfo=${response.headers.get('authorization').replace('Bearer ', '')}; path=/`;
        }

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        // console.log(redirect, router, '???????????');
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }
    },

    * getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      // setAuthority(payload.headers.get('authorization'));
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
