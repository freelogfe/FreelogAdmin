import { Effect, Reducer } from 'umi';
import { AnyAction } from 'redux';

import frequest, { MessageInfo } from '@/services/handler'
 

export interface FilterDataType {
  skip: number,
  limit: number,
  keywords: string,
  tagIds: string,
  startRegisteredDate: any,
  endRegisteredDate: any,
  sort: 1
}
export interface UsersModelState {
  users: Array<object>;
  currentUserIds: string;
  total: number;
  tags: Array<object>;
  loading: boolean;
  filterData: FilterDataType
}

export interface UsersModelType {
  namespace: 'users';
  state: UsersModelState;
  effects: {
    getUsers: Effect;
    deleteUserTag: Effect;
    addUserTag: Effect;
    freeze: Effect;
    unfreeze: Effect;
    getTags: Effect;
    addTag: Effect;
    deleteTag: Effect;
    updateTag: Effect;
  };
  reducers: {
    saveUsers: Reducer<UsersModelState>;
    saveTags: Reducer<UsersModelState>;
    saveTotal: Reducer<UsersModelState>;
    toggleLoading: Reducer<UsersModelState>;
    saveFilterData: Reducer<UsersModelState>;
  };
}
const defaultState: UsersModelState = {
  users: [],
  total: 0,
  currentUserIds: '',
  tags: [],
  loading: false,
  filterData: {
    skip: 0,
    limit: 10,
    keywords: '',
    tagIds: '',
    startRegisteredDate: '',
    endRegisteredDate: '',
    sort: 1
  }
}
const UsersModel: UsersModelType = {
  namespace: 'users',
  state: {
    ...defaultState
  },
  effects: {
    *addTag(action, saga) {
      const { call, put } = saga
      yield call(frequest, 'admin.postTag', [], { type: 1, tags: [action.payload] });
      yield put({
        type: 'getTags',
        payload: ''
      });
    },
    *updateTag({ payload }, saga) {
      const { call, put } = saga
      const res = yield call(frequest, 'admin.updateTag', [payload.tagId], { tag: payload.tag });
      if (res.errcode === 0) {
        yield put({
          type: 'getTags',
          payload: ''
        });
        yield put({
          type: 'getUsers',
          payload: ''
        });
      }
    },
    // TODO 错误处理
    *deleteTag(action, saga) {
      const { call, put } = saga
      const res = yield call(frequest, 'admin.deleteTag', [action.payload], '', { success: '删除成功', fail: '' });
      // TODO 可以在全局处理，传递参数判断是否需要提示以及成功失败提示语 或直接取msg
      if (res.errcode === 0) {
        yield put({
          type: 'getTags',
          payload: ''
        });
        yield put({
          type: 'getUsers',
          payload: ''
        });
      }
    },
    *getTags(action, saga) {
      const { call, put } = saga
      const tagsRes = yield call(frequest, 'admin.getTags', []);
      yield put({
        type: 'saveTags',
        payload: tagsRes.data || []
      });
    },
    *getUsers(action, saga) {
      const { call, put, all, fork, select } = saga
      if (action.payload) {
        yield put({
          type: 'toggleLoading',
          payload: true
        });
      }
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
      const filterData = yield select(({ users }: any) => users.filterData);
      const users = yield call(frequest, 'admin.getUsers', [], action.payload || filterData);
      if (users.errcode === 0) {
        users.data.dataList = users.data.dataList.map((item: any) => {
          const _me = [item.mobile, item.email]
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
      } 
    },
    *deleteUserTag({ payload }, saga) {
      const { call, put, select } = saga
      // TODO 错误处理
      const response = yield call(frequest, 'admin.cancelUserTag', [payload.userId], { tagId: payload.tagId }, { success: '删除成功', fail: '' });
      if (response.errcode === 0) {
        let users = yield select(({ users }: any) => users.users);
        const currentUserIds = yield select(({ users }: any) => users.currentUserIds);
        users.some((item: any) => {
          if (item.userId === payload.userId) {
            item.tags = item.tags.filter((tag: any) => payload.tagId !== tag.tagId)
            return true
          }
          return false
        })
        yield put({
          type: 'saveUsers',
          payload: [[...users], currentUserIds]
        });
      }
    },
    *addUserTag({ payload }, saga) {
      const { call, put } = saga
      let { tagIds, newTags, userId } = payload
      if (newTags.length) {
        const savedTags = yield call(frequest, 'admin.postTag', [], {
          type: 1, tags: newTags
        });
        // TODO 错误处理
        console.log(savedTags);
        (savedTags.data || []).forEach((item: any) => { tagIds.push(item.tagId) })
      }
      // TODO 错误处理
      const response = yield call(frequest, 'admin.setUserTag', [userId], { tagIds }, { success: '设置成功', fail: '设置失败' });
      console.log(response)
      if (response.errcode === 0) {
        yield put({
          type: 'getUsers',
          payload: ''
        });
      }
    },
    *freeze({payload}, saga) {
      const { call, put } = saga
      const response = yield call(frequest, 'admin.freeze', [payload.userId], {status: 1, remark: payload.remark}, { success: '冻结成功', fail: '冻结失败' });
      if (response.errcode === 0) {
        yield put({
          type: 'getUsers',
          payload: ''
        });
      }
    },
    *unfreeze({payload}, saga) {
      const { call, put } = saga
      const response = yield call(frequest, 'admin.freeze', [payload], {status: 0, remark: ''}, { success: '恢复成功', fail: '恢复失败' });
      if (response.errcode === 0) {
        yield put({
          type: 'getUsers',
          payload: ''
        });
      }
    },
  },
  reducers: {
    saveFilterData(state: UsersModelState = defaultState, action: AnyAction) {
      return {
        ...state,
        filterData: action.payload
      };
    },
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
        tags: action.payload || []
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
