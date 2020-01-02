import React from 'react';
import {message, Table, Button, Pagination, Select} from 'antd';
import moment from 'moment';

import {applyRecords} from '@/services/admin';

import styles from './index.less';

export default function () {

  const [dataSource, setDataSource] = React.useState<any[] | null>(null);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [current, setCurrent] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [status, setStatus] = React.useState<number>(-1);
  const [selectedRowKeys, setsSelectedRowKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    handleData();
  }, [current, pageSize, status]);

  const handleData = async () => {
    const response = await applyRecords({
      page: current,
      pageSize: pageSize,
      status: status,
    });
    // console.log(response, 'responseresponse');
    if (response.errcode !== 0 || response.ret !== 0) {
      return message.error(response.msg);
    }
    const data = response.data;
    setsSelectedRowKeys([]);
    setTotal(data.totalItem);
    setDataSource(data.dataList);
  };

  const columns = [
    {
      title: '申请日期',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text: string) => {
        return moment(text).format('YYYY-MM-DD');
      }
    },
    {
      title: '申请信息',
      dataIndex: 'description',
      key: 'description',
      // render: (text: string) => {
      //   return moment(text).format('YYYY-MM-DD');
      // }
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
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    // {
    //   title: '最后登录',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    {
      title: () => {
        // 0:待审核 1:审核通过 2:审核不通过 默认全部
        return (<Select
          value={status}
          style={{width: 120}}
          onChange={(value: number) => {
            setCurrent(1);
            setStatus(value);
          }}
        >
          <Select.Option value={-1}>全部状态</Select.Option>
          <Select.Option value={0}>待审核</Select.Option>
          <Select.Option value={1}>审核通过</Select.Option>
          <Select.Option value={2}>审核不通过</Select.Option>
        </Select>);
      },
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
      }
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
            return <Button type="link">审核</Button>;
          case 2:
            return <Button type="link">详情</Button>;
          case 1:
          default:
            return <span>--</span>;
        }
      },
    },
  ];

  const rowSelection = {
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setsSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 0, // Column configuration not to be checked
    }),
  };

  return (
    <div className={styles.normal}>
      <div style={{padding: '8px 0'}}>
        <span>已选中 {selectedRowKeys.length} 条</span>
        <Button
          type="link"
          disabled={selectedRowKeys.length === 0}
        >批量审核</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={dataSource || []}
        // @ts-ignore
        columns={columns}
        rowKey={'recordId'}
        pagination={false}
        scroll={{x: true}}
      />

      {
        total !== 0 ?
          (<div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: 16}}>
            <Pagination
              showSizeChanger
              current={current}
              onChange={(current: number) => {
                setCurrent(current);
              }}
              pageSize={pageSize}
              onShowSizeChange={(current: number, size: number) => {
                setPageSize(size);
                setCurrent(1);
              }}
              total={total}
              pageSizeOptions={['10', '20', '30', '40', '50']}
            />
          </div>)
          : null
      }
    </div>
  );
}
