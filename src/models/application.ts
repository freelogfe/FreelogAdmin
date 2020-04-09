import { Reducer } from 'redux';
import { Effect, EffectsCommandMap } from 'dva';
// import { query as queryUsers } from '../services/user';
import { applyRecords as applyRecordsAPI } from '../services/admin';
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
}

export interface ApplicationModelType {
  namespace: string;
  state: StateType;
  effects: {
    getDataSource: Effect,
    changePage: Effect,
  };
  reducers: {
    changeDataSourceStatus: Reducer<StateType>;
    changePageSizeStatus: Reducer<StateType>;
    changeTotalStatus: Reducer<StateType>;
    changeStatusStatus: Reducer<StateType>;
  };
}

const Model: ApplicationModelType = {
  namespace: 'application',

  state: {
    dataSource: [],
    pageSize: 10,
    current: 1,
    total: -1,

    status: -1,
  },

  effects: {
    // * getAllUsers({payload}, {call, put}) {
    * getDataSource(_, { call, put, select }) {
      const params = yield select(({ application }: any) => ({
        pageSize: application.pageSize,
        page: application.current,
        status: application.status,
      }));
      const response = yield call(applyRecordsAPI, params);
      // console.log(response, 'response');
      yield put({
        type: 'changeDataSourceStatus',
        dataSource: response.data.dataList,
        total: response.data.totalItem,
      });
    },
    * changePage({ payload }, { put }) {
      // console.log(payload, 'type, payloadtype, payload');
      if (payload.current) {
        yield put({ type: 'changePageStatus', type2: 'CURRENT', current: payload.current });
      } else {
        yield put({ type: 'changePageStatus', type2: 'PAGE_SIZE', pageSize: payload.pageSize });
      }

      yield put({ type: 'getDataSource' });
    },

    * changeStatus({ payload }: any, { put }: EffectsCommandMap) {
      yield put({ type: 'changeStatusStatus', status: payload });
      yield put({ type: 'getDataSource' });
    },
  },

  reducers: {
    changeDataSourceStatus(state: StateType, { dataSource, total }: any): StateType {
      // console.log(applyRecords, 'applyRecords');
      // console.log(state, 'state');
      return {
        ...state,
        dataSource,
        total,
      };

    },
    changePageStatus(state: StateType, { type2, pageSize, current }: any) {
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

    changeStatusStatus(state: StateType, { status }: any) {
      return {
        ...state,
        status,
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
