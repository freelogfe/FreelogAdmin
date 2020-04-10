import { AnyAction, Reducer } from 'redux';
import { Effect, EffectsCommandMap } from 'dva';
// import { query as queryUsers } from '../services/user';
import { applyRecords as applyRecordsAPI, betaAudit } from '@/services/admin';
import { searchUser } from '@/services/user';
import { message } from 'antd';

// import {stringify} from 'querystring';
// import router from 'umi/router';

// import {fakeAccountLogin, getFakeCaptcha} from '@/services/login';
// import {setAuthority} from '@/utils/authority';
// import {getPageQuery} from '@/utils/utils';

export interface StateType {
  dataSource: any[];
  pageSize: number;
  current: number;
  total: number;
  status: number;

  searchedText: string;
  searchedUserID: number;

  selectedRowKeys: string[];
  handledRecordIds: string[];
  auditValue: number;
  otherReasonValue: string;
}

export interface ApplicationModelType {
  namespace: string;
  state: StateType;
  effects: {
    getDataSource: Effect,
    changePage: Effect,
    changeStatus: Effect,
    filterUser: Effect,
    approvals: Effect,
  };
  reducers: {
    changeDataSourceStatus: Reducer<StateType>;
    changePageSizeStatus: Reducer<StateType>;
    changeTotalStatus: Reducer<StateType>;
    changeStatusStatus: Reducer<StateType>;
    changeSearchedTextStatus: Reducer<StateType>;
    changeSearchedUserIDStatus: Reducer<StateType>;
    changeSelectedRowKeysStatus: Reducer<StateType>;
    changeHandledRecordIdsStatus: Reducer<StateType>;
    changeAuditValueStatus: Reducer<StateType>;
    changeOtherReasonValueStatus: Reducer<StateType>;
  };
}

const defaultState: StateType = {
  dataSource: [],
  pageSize: 10,
  current: 1,
  total: -1,
  status: -1,

  searchedText: '',
  searchedUserID: 0,

  selectedRowKeys: [],
  handledRecordIds: [],
  auditValue: 1,
  otherReasonValue: '',
};

// @ts-ignore
const Model: ApplicationModelType = {
  namespace: 'application',

  state: {
    ...defaultState,
  },

  effects: {
    // * getAllUsers({payload}, {call, put}) {
    * getDataSource(_, { call, put, select }: EffectsCommandMap): Generator<any, void, any> {
      const params = yield select(({ application }: any) => ({
        pageSize: application.pageSize,
        page: application.current,
        status: application.status,
        userId: application.searchedUserID,
      }));
      const response = yield call(applyRecordsAPI, params);
      // console.log(response, 'response');
      yield put({
        type: 'changeDataSourceStatus',
        dataSource: response.data.dataList,
        total: response.data.totalItem,
      });
    },
    * changePage({ payload }, { put }: EffectsCommandMap): Generator<any, void, any> {
      // console.log(payload, 'type, payloadtype, payload');
      if (payload.current) {
        yield put({ type: 'changePageStatus', type2: 'CURRENT', current: payload.current });
      } else {
        yield put({ type: 'changePageStatus', type2: 'PAGE_SIZE', pageSize: payload.pageSize });
      }

      yield put({ type: 'getDataSource' });
    },

    * changeStatus({ payload }: any, { put }: EffectsCommandMap): Generator<any, void, any> {
      yield put({ type: 'changeStatusStatus', status: payload });
      yield put({ type: 'getDataSource' });
    },

    * filterUser({ payload }: any, { put, call }: EffectsCommandMap): Generator<any, void, any> {
      // console.log(payload, 'payloadpayload');
      if (!payload) {
        yield put({ type: 'changeSearchedUserIDStatus', payload: 0 });
      } else {
        const response = yield call(searchUser, { keywords: payload });
        // if (response.errcode !== 0 || response.ret !== 0) {
        //   return message.error(response.msg);
        // }
        if (response.data) {
          yield put({ type: 'changeSearchedUserIDStatus', payload: response.data.userId });
        } else {
          yield put({ type: 'changeSearchedUserIDStatus', payload: -1 });
        }
      }

      yield put({ type: 'getDataSource' });
    },

    * approvals(_: any, { put, call, select }: EffectsCommandMap): Generator<any, any, any> {

      let status: 1 | 2 = 1;
      let auditMsg: string = '';
      const {auditValue, otherReasonValue, handledRecordIds} = yield select(({ application }: any) => ({
        auditValue: application.auditValue,
        otherReasonValue: application.otherReasonValue,
        handledRecordIds: application.handledRecordIds,
      }));
      switch (auditValue) {
        case 2:
          status = 2;
          auditMsg = '链接无法打开';
          break;
        case 3:
          status = 2;
          auditMsg = '公众号ID不存在';
          break;
        case 4:
          status = 2;
          auditMsg = otherReasonValue || '其它原因';
          break;
        default:
          break;
      }
      // console.log({
      //   recordIds: handledRecordIds,
      //   status: status,
      //   auditMsg: auditMsg,
      // }, '!@#@#@#@#@#');
      // return ;
      const response = yield call(betaAudit, {
        recordIds: handledRecordIds,
        status,
        auditMsg,
      });
      if (response.errcode !== 0 || response.ret !== 0) {
        message.error(response.msg);
      } else {
        yield put({type: 'changeHandledRecordIdsStatus', payload: []});
        yield put({ type: 'getDataSource' });
        message.success('修改状态成功');
      }

    },
  },

  reducers: {
    changeDataSourceStatus(state: StateType = defaultState, { dataSource, total }: AnyAction): StateType {
      // console.log(applyRecords, 'applyRecords');
      // console.log(state, 'state');
      return {
        ...state,
        dataSource,
        total,
      };

    },
    // @ts-ignore
    changePageStatus(state: StateType, { type2, pageSize, current }: AnyAction): StateType {
      switch (type2) {
        case 'CURRENT':
          return {
            ...state,
            current,
          };
        case 'PAGE_SIZE':
          return {
            ...state,
            pageSize,
            current: 1,
          };
        default:
          return state;
      }
    },

    changeStatusStatus(state: StateType = defaultState, { status }: AnyAction): StateType {
      return {
        ...state,
        status,
        current: 1,
      };
    },
    changeSearchedTextStatus(state: StateType = defaultState, { payload }: AnyAction): StateType {
      return {
        ...state,
        searchedText: payload,
      };
    },
    changeSearchedUserIDStatus(state: StateType = defaultState, { payload }: AnyAction): StateType {
      return {
        ...state,
        searchedUserID: payload,
        current: 1,
      };
    },
    changeSelectedRowKeysStatus(state: StateType = defaultState, { payload }: AnyAction): StateType {
      return {
        ...state,
        selectedRowKeys: payload,
      };
    },
    changeHandledRecordIdsStatus(state: StateType = defaultState, { payload }: AnyAction): StateType {
      return {
        ...state,
        handledRecordIds: payload,
      };
    },
    changeAuditValueStatus(state: StateType = defaultState, { payload }: AnyAction): StateType {
      return {
        ...state,
        auditValue: payload,
      };
    },
    changeOtherReasonValueStatus(state: StateType = defaultState, { payload }: AnyAction): StateType {
      return {
        ...state,
        otherReasonValue: payload,
      };
    },
  },
  // subscriptions: {
  //   setup(action: any, error: any) {
  //     console.log(this, 'TTTT');
  //     console.log(action);
  //     console.log(error);
  //   },
  // },
};

export default Model;
