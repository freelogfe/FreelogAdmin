import { AnyAction, Reducer } from 'redux';
import { Effect, EffectsCommandMap } from 'dva';
import { applyRecords as applyRecordsAPI, betaAudit } from '@/services/admin';
import frequest from '@/services/handler'
import { message } from 'antd';
 

export interface ApplicationModelState {
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
  state: ApplicationModelState;
  effects: {
    getDataSource: Effect,
    changePage: Effect,
    changeStatus: Effect,
    filterUser: Effect,
    approvals: Effect,
  };
  reducers: {
    changeDataSourceStatus: Reducer<ApplicationModelState>;
    changePageSizeStatus: Reducer<ApplicationModelState>;
    changeTotalStatus: Reducer<ApplicationModelState>;
    changeStatusStatus: Reducer<ApplicationModelState>;
    changeSearchedTextStatus: Reducer<ApplicationModelState>;
    changeSearchedUserIDStatus: Reducer<ApplicationModelState>;
    changeSelectedRowKeysStatus: Reducer<ApplicationModelState>;
    changeHandledRecordIdsStatus: Reducer<ApplicationModelState>;
    changeAuditValueStatus: Reducer<ApplicationModelState>;
    changeOtherReasonValueStatus: Reducer<ApplicationModelState>;
  };
}

const defaultState: ApplicationModelState = {
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { selectedRowKeys, dataSource } = yield select(({ application }: any) => ({
        selectedRowKeys: application.selectedRowKeys,
        dataSource: application.dataSource,
      }));
      const dataSourceIDs: string[] = dataSource
        .filter((j: { status: number }) => j.status === 0)
        .map((i: { recordId: string; }) => i.recordId);
      // console.log(dataSourceIDs, 'dataSourceIDs');
      yield put({
        type: 'changeSelectedRowKeysStatus',
        payload: selectedRowKeys.filter((i: string) => dataSourceIDs.includes(i)),
        // payload: [],
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
        const response = yield call(frequest, 'user.searchUser', [], { keywords: payload });
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
      const { auditValue, otherReasonValue, handledRecordIds } = yield select(({ application }: any) => ({
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
        yield put({ type: 'changeHandledRecordIdsStatus', payload: [] });
        yield put({ type: 'getDataSource' });
        message.success('修改状态成功');
      }

    },
  },

  reducers: {
    changeDataSourceStatus(state: ApplicationModelState = defaultState, { dataSource, total }: AnyAction): ApplicationModelState {
      // console.log(applyRecords, 'applyRecords');
      // console.log(state, 'state');
      return {
        ...state,
        dataSource,
        total,
      };

    },
    // @ts-ignore
    changePageStatus(state: ApplicationModelState, { type2, pageSize, current }: AnyAction): ApplicationModelState {
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

    changeStatusStatus(state: ApplicationModelState = defaultState, { status }: AnyAction): ApplicationModelState {
      return {
        ...state,
        status,
        current: 1,
      };
    },
    changeSearchedTextStatus(state: ApplicationModelState = defaultState, { payload }: AnyAction): ApplicationModelState {
      return {
        ...state,
        searchedText: payload,
      };
    },
    changeSearchedUserIDStatus(state: ApplicationModelState = defaultState, { payload }: AnyAction): ApplicationModelState {
      return {
        ...state,
        searchedUserID: payload,
        current: 1,
      };
    },
    changeSelectedRowKeysStatus(state: ApplicationModelState = defaultState, { payload }: AnyAction): ApplicationModelState {
      return {
        ...state,
        selectedRowKeys: payload,
      };
    },
    changeHandledRecordIdsStatus(state: ApplicationModelState = defaultState, { payload }: AnyAction): ApplicationModelState {
      return {
        ...state,
        handledRecordIds: payload,
      };
    },
    changeAuditValueStatus(state: ApplicationModelState = defaultState, { payload }: AnyAction): ApplicationModelState {
      return {
        ...state,
        auditValue: payload,
      };
    },
    changeOtherReasonValueStatus(state: ApplicationModelState = defaultState, { payload }: AnyAction): ApplicationModelState {
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
