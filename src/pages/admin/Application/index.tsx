import React from 'react';
import {message, Table, Button} from 'antd';
import {applyRecords} from '@/services/admin';

import styles from './index.less';

export default function () {

  const [dataSource, setDataSource] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    handleData();
  }, []);

  const handleData = async () => {
    const response = await applyRecords({});
    // console.log(response, 'responseresponse');
    if (response.errcode !== 0 || response.ret !== 0) {
      return message.error(response.msg);
    }
    setDataSource(response.data.dataList);
  };

  const columns = [
    {
      title: '申请日期',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: '申请信息',
      dataIndex: 'description',
      key: 'description',
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
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any) => {
        switch (record.status) {
          case 0:
            return <Button type="link">审核</Button>;
          case 1:
            return <span>--</span>;
          default:
            return <Button type="link">详情</Button>;
        }
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div className={styles.normal}>
      <div>
        <span>已选中 10 条</span>
        <Button type="link">批量审核</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={[
          ...(dataSource || []),
          {
            "recordId": "5e047e3b509201111476b722",
            "auditMsg": "审核通过",
            "operationUserId": 50003,
            "status": 1,
            "auditCount": 0,
            "userId": 50003,
            "username": "yuliang",
            "province": "广东",
            "city": "深圳",
            "phone": '178565684090',
            "email": '1025234234@qq.com',
            "occupation": "软件开发",
            "description": "公众号:abcd",
            "createDate": "2019-12-26T09:32:43.667Z",
            "updateDate": "2019-12-26T09:48:04.931Z"
          }
        ] || []}
        columns={columns}
        rowKey={'recordId'}
      />
    </div>
  );
}
