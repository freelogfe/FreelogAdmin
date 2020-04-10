import React, { ChangeEvent } from 'react';
import { Table, Button, Select, Input, Popover, Pagination, Modal, Radio } from 'antd';
import moment from 'moment';

// import { applyRecords, betaAudit } from '@/services/admin';

import styles from './index.less';
// import { searchUser, userinfos } from '@/services/user';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface IApplication {
  dataSource: any[];
  pageSize: number;
  current: number;
  total: number;
  status: number;
  getDataSource: (params: { pageSize: number, current: number }) => void;
  changePage: (payload: { current?: number, pageSize?: number }) => void;
  changeStatus: (payload: number) => void;
  searchedText: string;
  changeSearchText: (value: string) => void;
  filterUser: (filterUser: string) => void;

  selectedRowKeys: string[];
  changeSelectedRowKeys: (payload: string[]) => void;
  handledRecordIds: string[];
  changeHandledRecordIds: (payload: string[]) => void;
  auditValue: number;
  changeAuditValue: (payload: number) => void;
  otherReasonValue: string;
  changeOtherReasonValue: (payload: string) => void;
  handleOk: () => void;
}

function Application({ dataSource, pageSize, current, total, getDataSource, changePage, status, changeStatus, searchedText, changeSearchText, filterUser, selectedRowKeys, changeSelectedRowKeys, handledRecordIds, changeHandledRecordIds, auditValue, changeAuditValue, otherReasonValue, changeOtherReasonValue, handleOk }: IApplication) {

  React.useEffect(() => {
    getDataSource({ pageSize, current });
  }, []);

  const columns = [
    {
      title: '申请日期',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '申请信息',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: any) => (<div style={{ width: 300, lineHeight: '24px' }}>
        <div>职业：{record.occupation}</div>
        <div>区域：{record.province}-{record.city}</div>
        <div>其它：{record.description}</div>
      </div>),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: number, record: any) => (record.userInfo ? record.userInfo.mobile : ''),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: number, record: any) => (record.userInfo ? record.userInfo.email : ''),
    },
    // {
    //   title: '最后登录',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    {
      title: () =>
        // 0:待审核 1:审核通过 2:审核不通过 默认全部
        (<Select
          value={status}
          style={{ width: 120 }}
          onChange={(value: number) => {
            changeStatus(value);
          }}
        >
          <Select.Option value={-1}>全部状态</Select.Option>
          <Select.Option value={0}>待审核</Select.Option>
          <Select.Option value={1}>审核通过</Select.Option>
          <Select.Option value={2}>审核不通过</Select.Option>
        </Select>)
      ,
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => {
        // 0:待审核 1:审核通过 2:审核不通过
        switch (text) {
          case 0:
            return '待审核';
          case 1:
            return '审核通过';
          case 2:
            return '审核不通过';
          default:
            return '---';
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 90,
      fixed: 'right',
      render: (text: any, record: any) => {
        switch (record.status) {
          case 0:
            return (<Button
              type="link"
              onClick={() => changeHandledRecordIds([record.recordId])}
            >审核</Button>);
          case 2:
            return (<Popover
              content={record.auditMsg}
              title="拒绝通过的原因"
            >
              <Button type="link">详情</Button>
            </Popover>);
          case 1:
          default:
            return <span>--</span>;
        }
      },
    },
  ];

  const rowSelection: any = {
    fixed: true,
    selectedRowKeys,
    onChange: changeSelectedRowKeys,
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 0, // Column configuration not to be checked
    }),
  };

  const handleCancel = () => {
    changeHandledRecordIds([]);
  };

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  // @ts-ignore
  return (
    <div className={styles.normal}>
      <div style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span>已选中 {selectedRowKeys.length} 条</span>
          <Button
            type="link"
            disabled={selectedRowKeys.length === 0}
            onClick={() => changeHandledRecordIds([...selectedRowKeys])}
          >批量审核</Button>
        </div>
        <Input.Search
          value={searchedText}
          onChange={e => changeSearchText(e.target.value)}
          onSearch={filterUser}
          placeholder="请输入用户名、注册邮箱/手机号进行搜索"
          enterButton="搜索"
          size="large"
          style={{ width: 400 }}
        />
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={dataSource || []}
        // @ts-ignore
        columns={columns}
        rowKey="recordId"
        pagination={false}
        scroll={{ x: true }}
      />

      {
        total !== 0 ?
          (<div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
            <Pagination
              showTotal={(total1, range) => `${range[0]}-${range[1]} of ${total1} items`}
              showSizeChanger
              current={current}
              onChange={(current1: number) => {
                changePage({ current: current1 });
              }}
              pageSize={pageSize}
              onShowSizeChange={(_current: number, size: number) => {
                changePage({ pageSize: size });
              }}
              total={total}
              pageSizeOptions={['10', '20', '30', '40', '50']}
            />
          </div>)
          : null
      }

      <Modal
        title="审核内测资格"
        visible={handledRecordIds.length !== 0}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="生成"
      >
        <Radio.Group
          value={auditValue}
          onChange={(e) => changeAuditValue(Number(e.target.value))}
        >
          <Radio style={radioStyle} value={1}>通过</Radio>
          <Radio style={radioStyle} value={2}>拒绝通过：链接无法打开</Radio>
          <Radio style={radioStyle} value={3}>拒绝通过：公众号ID不存在</Radio>
          <Radio style={radioStyle} value={4}>拒绝通过：其它原因</Radio>
        </Radio.Group>
        {auditValue === 4
          ? <Input.TextArea
            value={otherReasonValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => changeOtherReasonValue(e.target.value)}
            style={{ display: 'block' }}
            placeholder="请输入拒绝通过原因（非必填）"
            rows={4}
          />
          : null}
      </Modal>
    </div>
  );
}

// export default Application;

export default connect(
  ({ application }: ConnectState) => ({
    dataSource: application.dataSource,
    pageSize: application.pageSize,
    current: application.current,
    total: application.total,
    status: application.status,
    searchedText: application.searchedText,
    selectedRowKeys: application.selectedRowKeys,
    handledRecordIds: application.handledRecordIds,
    auditValue: application.auditValue,
    otherReasonValue: application.otherReasonValue,
  }),
  {
    getDataSource: (params: any) => ({
      type: 'application/getDataSource',
      params,
    }),
    changePage: (payload: any) => ({
      type: 'application/changePage',
      payload,
    }),
    changeStatus: (payload: any) => ({
      type: 'application/changeStatus',
      payload,
    }),

    changeSearchText: (payload: any) => ({
      type: 'application/changeSearchedTextStatus',
      payload,
    }),
    filterUser: (payload: any) => ({
      type: 'application/filterUser',
      payload,
    }),

    changeSelectedRowKeys: (payload: string[]) => ({
      type: 'application/changeSelectedRowKeysStatus',
      payload,
    }),
    changeHandledRecordIds: (payload: string[]) => ({
      type: 'application/changeHandledRecordIdsStatus',
      payload,
    }),

    changeAuditValue: (payload: number) => ({
      type: 'application/changeAuditValueStatus',
      payload,
    }),
    changeOtherReasonValue: (payload: string) => ({
      type: 'application/changeOtherReasonValueStatus',
      payload,
    }),

    handleOk: () => ({
      type: 'application/approvals',
    }),

  },
)(Application);
