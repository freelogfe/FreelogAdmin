import { Reducer } from 'redux';
import { Effect } from 'dva';
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
  };
}

const Model: ApplicationModelType = {
  namespace: 'application',

  state: {
    dataSource: [],
    pageSize: 20,
    current: 1,
    total: -1,
  },

  effects: {
    // * getAllUsers({payload}, {call, put}) {
    * getDataSource({ params }, { call, put }) {
      const response = yield call(applyRecordsAPI, params);
      // console.log(response, 'response');
      yield put({
        type: 'changeDataSourceStatus',
        dataSource: response.data.dataList,
        total: response.data.totalItem,
      });
    },
    * changePage({ payload }, { put }) {
      console.log(payload, 'type, payloadtype, payload');
      if (payload.current) {
        yield put({ type: 'changePageStatus', type2: 'CURRENT', current: payload.current });
      } else {
        yield put({ type: 'changePageStatus', type2: 'PAGE_SIZE', pageSize: payload.pageSize });
      }

    },
  },

  reducers: {
    changeDataSourceStatus(state: StateType, { dataSource, total }: any) {
      // console.log(applyRecords, 'applyRecords');
      // console.log(state, 'state');
      return {
        ...state,
        dataSource,
        total,
      };
    },
    changePageStatus(state: StateType, { type2, pageSize, current }: any) {
      console.log(type2, current, 'currentcurrent');
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
          };
        default:
          return state;
      }
    },
  },
};

export default Model;
