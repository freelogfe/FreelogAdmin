import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import frequest from '@/services/handler'
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { isDevelopmentEnv } from '@/utils/utils';

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
    *login({ payload }, { call, put }) {
      const  datas = yield call(frequest, 'user.login', [], payload); 
      const {response, data} = datas
      console.log(datas)
      yield put({
        type: 'changeLoginStatus',
        payload: response.status === 200 ? 'ok' : 'error',
      }); 
      // Login successfully
      if (response === undefined || (data.errcode === 0 && data.ret === 0)) {
        if (isDevelopmentEnv()) {
          window.document.cookie = `authInfo=${response.headers.get('authorization').replace('Bearer ', '')}; path=/`;
        }
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        // message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params as { redirect: string };
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
        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
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
      return {
        ...state,
        status: payload,
        type: payload.type,
      };
    },
  },
};

export default Model;
