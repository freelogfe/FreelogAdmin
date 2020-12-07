import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import frequest from '@/services/handler'
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { isDevelopmentEnv } from '@/utils/utils';
import { delCookie, getCookie } from '@/utils/cookie'
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
      const datas = yield call(frequest, 'user.login', [], payload);
      const { response, data } = datas
      yield put({
        type: 'changeLoginStatus',
        payload: data && data.ret === 0 ? 'ok' : 'error',
      });
      yield put({
        type: 'user/saveCurrentUser',
        payload: data && data.ret === 0 ? data.data:{},
      });
      // Login successfully
      if (data && data.ret === 0) {
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

    *logout({ payload }, { call, put }) {
      const { redirect } = getPageQuery();
      yield call(frequest, 'user.loginOut', [redirect], {returnUrl: window.location.href});
      yield put({
        type: 'changeLoginStatus',
        payload: '',
      });
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
