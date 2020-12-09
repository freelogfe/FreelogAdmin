import { Effect, Reducer } from 'umi';
import { AnyAction } from 'redux';

import frequest from '@/services/handler'



export interface UsersModelState {
  users: Array<object>;
  currentUserIds: string;
  total: number;
  tags: Array<object>;
  loading: boolean;
}

export interface UsersModelType {
  namespace: 'users';
  state: UsersModelState;
  effects: {
    getUsers: Effect;
    deleteTag: Effect;
    addTag: Effect;
    freeze: Effect;
    unfreeze: Effect;
    getTags: Effect;
  };
  reducers: {
    saveUsers: Reducer<UsersModelState>;
    saveTags: Reducer<UsersModelState>;
    saveTotal: Reducer<UsersModelState>;
    toggleLoading: Reducer<UsersModelState>;
  };
}
const defaultState: UsersModelState = {
  users: [],
  total: 0,
  currentUserIds: '',
  tags: [],
  loading: false
}
const UsersModel: UsersModelType = {
  namespace: 'users',
  state: {
    ...defaultState
  },
  effects: {
    *getTags(action, saga) {
      let { call, put } = saga
      const tagsRes = yield call(frequest, 'admin.getTags', []);
      yield put({
        type: 'saveTags',
        payload: tagsRes.data
      });
    },
    *getUsers(action, saga) {
      let { call, put, all, fork, select } = saga
      yield put({
        type: 'toggleLoading',
        payload: true
      });
      // TODO 错误情况
      let currentUserIds = ''
      const tags = yield select(({ users }: any) => users.tags);
      if (!tags.length) {
        yield fork(function* () {
          yield put({
            type: 'getTags',
            payload: ''
          });
        })
      }
      const users = yield call(frequest, 'admin.getUsers', [], action.payload);
      users.data.dataList = users.data.dataList.map((item: any) => {
        let _me = [item.mobile, item.email]
        currentUserIds ? currentUserIds += ',' + item.userId : currentUserIds = item.userId
        return { ...item, key: item.userId, _me }
      })
      const [fresources, fnodes, fcontracts] = yield all([
        call(frequest, 'resource.getResources', [], { userIds: currentUserIds }),
        call(frequest, 'node.getNodes', [], { userIds: currentUserIds }),
        call(frequest, 'contract.getContracts', [], { userIds: currentUserIds })
      ])
      function getValue(arr: [], obj: any, key: string, origin: any) {
        obj[key] = origin
        arr.some((item: any) => {
          if (item.userId === obj.userId) {
            obj[key] = item[key] || origin
            return true
          }
          return false
        });
      }
      users.data.dataList = users.data.dataList.map((user: any) => {
        getValue(fresources.data || [], user, 'createdResourceCount', 0)
        getValue(fnodes.data || [], user, 'createdNodeCount', 0)
        getValue(fcontracts.data || [], user, 'signedContractCount', 0)
        return user
      })
      yield put({
        type: 'saveUsers',
        payload: [users.data.dataList || [], currentUserIds]
      });
      yield put({
        type: 'saveTotal',
        payload: users.data.totalItem
      });
      yield put({
        type: 'toggleLoading',
        payload: false
      });
    },
    *deleteTag(action, saga) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
    *addTag(action, saga) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
    *freeze(action, saga) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
    *unfreeze(action, saga) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
  },
  reducers: {
    saveUsers(state: UsersModelState = defaultState, action: AnyAction) {
      return {
        ...state,
        users: action.payload[0] || [],
        currentUserIds: action.payload[1]
      };
    },
    saveTags(state: UsersModelState = defaultState, action: AnyAction) {
      return {
        ...state,
        tags: action.payload
      };
    },
    saveTotal(state: UsersModelState = defaultState, action: AnyAction) {
      return {
        ...state,
        total: action.payload
      };
    },
    toggleLoading(state: UsersModelState = defaultState, action: AnyAction) {
      return {
        ...state,
        loading: action.payload
      };
    },
  }
};

export default UsersModel;
