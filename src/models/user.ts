import { Effect, Reducer, history } from 'umi';

import frequest from '@/services/handler'

export interface CurrentUser {
  email: string;
  mobile: string;
  headImage: string;
  userType: number;
  status: number;
  username: string;
  userId: number;
  tokenSn: string;
  createDate: string;
}

export interface UserModelState {
  currentUser?: CurrentUser | object;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(state, action) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      if (response) {
        yield put({
          type: 'login/changeLoginStatus',
          payload: 'ok'
        });
        yield put({
          type: 'saveCurrentUser',
          payload: response.data
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
