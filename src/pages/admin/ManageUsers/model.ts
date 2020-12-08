import { Effect, Reducer, history } from 'umi';

import frequest from '@/services/handler'

export interface PagingData {
  skip: number;
  limit: number;
  keywords: string;
  tagIds: string;
  startRegisteredDate: Date | null;
  endRegisteredDate: Date | null;
}

export interface UsersModelState {
  users: Array<object>;
  pagingData: PagingData;
  currentUserIds: string;
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
  };
  reducers: {
    saveUsers: Reducer<UsersModelState>;
  };
}

const UsersModel: UsersModelType = {
  namespace: 'users',
  state: {
    users: [],
    pagingData: {
      skip: 0,
      limit: 30,
      keywords: '',
      tagIds: '',
      startRegisteredDate: null,
      endRegisteredDate: null
    },
    currentUserIds: ''
  },
  effects: {
    *getUsers(state, action) {
      let { call, put, all } = action
      const users = yield call(frequest, 'admin.getUsers', [], action.payload);
      // TODO 错误情况
      let currentUserIds = ''
      users.data.dataList = users.data.dataList.map((item: any) => {
        let _me = [item.mobile, item.email || 'chsignup5@mailinator.com']
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
            obj[key] = item.createdResourceCount || origin
            return true
          }
          return false
        });
      }
      users.data.dataList = users.data.dataList.map((user: any) => {
        getValue(fresources.data || [], user, 'resources', 0)
        getValue(fnodes.data || [], user, 'nodes', 0)
        getValue(fcontracts.data || [], user, 'contracts', 0)
        return user
      })
      yield put({
        type: 'saveUsers',
        payload: [users.data.dataList, currentUserIds]
      });
    },
    *deleteTag(state, action) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
    *addTag(state, action) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
    *freeze(state, action) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
    *unfreeze(state, action) {
      let { call, put } = action
      const response = yield call(frequest, 'user.queryCurrent', [], '');
      yield put({
        type: 'saveUsers',
        payload: response.data
      });
    },
  },
  reducers: {
    saveUsers(state, action) {
      return {
        ...state,
        users: action.payload[0] || {},
        currentUserIds: action.payload[1]
      };
    }
  }
};

export default UsersModel;
