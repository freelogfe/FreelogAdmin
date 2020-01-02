import React from 'react';
import {Button, Table, Modal, InputNumber, message} from 'antd';
import moment from 'moment';

import {batchCreate, selectBetaCodes} from '@/services/admin';

import styles from './index.less';

export default function () {

  const [dataSource, setDataSource] = React.useState<any[] | null>(null);
  const [visible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    handleData();
  }, []);

  const handleData = async () => {
    const response = await selectBetaCodes({});
    if (response.ret !== 0 || response.errcode !== 0) {
      return message.error(response.msg);
    }
    setDataSource(response.data.dataList);
  };

  const columns = [
    {
      title: '生成时间',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text: string) => {
        return moment(text).format('YYYY-MM-DD');
      }
    },
    {
      title: '邀请码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: ((text: number) => {
        // 0:未使用 1:已分发 2:已核销=
        switch (text) {
          case 0:
            return '未使用';
          case 1:
            return '已分发';
          case 2:
            return '已核销';
          default:
            return '---';
        }
      })
    },
    {
      title: '分发时间',
      dataIndex: 'distributeDate',
      key: 'distributeDate',
    },
    {
      title: '核销时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      render: (text: string) => {
        return moment(text).format('YYYY-MM-DD');
      }
    },
    {
      title: '核销用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '手机号',
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
    //   dataIndex: 'createDate',
    //   key: 'createDate',
    // },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      fixed: 'right',
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

  const handleOk = async () => {
    const response = await batchCreate({});
    if (response.ret !== 0 || response.errcode !== 0) {
      return message.error(response.msg);
    }
    setVisible(false);
    console.log(response, '#######');
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onChange = () => {

  };

  return (
    <div className={styles.normal}>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          type="primary"
          icon="plus"
          onClick={() => setVisible(true)}
        >批量生成邀请码</Button>
      </div>
      <div>
        <span>已选中 10 条</span>
        <Button type="link">批量更改状态</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={dataSource || []}
        // @ts-ignore
        columns={columns}
        rowKey={'code'}
      />

      <Modal
        title="批量生成邀请码"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="生成"
      >
        <InputNumber
          min={1}
          max={50}
          defaultValue={10}
          onChange={onChange}
        />
      </Modal>
    </div>
  );
}
