import React from 'react';
import { Button, Table, Modal, InputNumber, Pagination, Select, Dropdown, Menu } from 'antd';
import moment from 'moment';

import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { TableRowSelection } from 'antd/lib/table/interface';
import styles from './index.less';

interface InviteCodeProps {
  dataSource: any[] | null;
  total: number;
  handleDataSource: () => void;
  pageSize: number;
  current: number;
  changePage: (payload: { pageSize?: number; current?: number; }) => void;
  status: number;
  changeStatus: (paylaod: number) => void;
  selectedRowKeys: string[];
  changeSelectedRowKeys: (payload: string[]) => void;
  updateStatus: (codes: string[], status: number) => void;
  modalVisible: boolean;
  changeModalVisible: (visble: boolean) => void;
  createQuantity: number;
  changeCreateQuantity: (payload: number) => void;
  batchCreate: () => void;
}

function InviteCode({ dataSource, total, handleDataSource, pageSize, current, changePage, status, changeStatus, selectedRowKeys, changeSelectedRowKeys, updateStatus, modalVisible, changeModalVisible, createQuantity, changeCreateQuantity, batchCreate }: InviteCodeProps) {

  // const [visible, setVisible] = React.useState<boolean>(false);
  // const [createQuantity, setCreateQuantity] = React.useState<number>(10);

  React.useEffect(() => {
    handleDataSource();
  }, []);

  const columns = [
    {
      title: '生成时间',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '邀请码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: () => (<Select
        value={status}
        style={{ width: 100 }}
        onChange={(value: number) => {
          // setCurrent(1);
          changeStatus(value);
        }}
      >
        <Select.Option value={-1}>全部状态</Select.Option>
        <Select.Option value={0}>未使用</Select.Option>
        <Select.Option value={1}>已分发</Select.Option>
        <Select.Option value={2}>已核销</Select.Option>
      </Select>),
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
      }),
      // filterDropdown: () => {
      //   const options = [
      //     {label: '未使用', value: 0},
      //     {label: '已分发', value: 1},
      //     {label: '已核销', value: 2},
      //   ];
      //   return (
      //     <div style={{padding: 8, width: 100}}>
      //       <Checkbox.Group
      //         options={options}
      //         defaultValue={['Apple']}
      //         onChange={onChange}
      //       />
      //       <Button
      //         type="primary"
      //         style={{display: 'block'}}
      //       >过滤</Button>
      //     </div>
      //   )
      // },
    },
    {
      title: '分发时间',
      dataIndex: 'distributeDate',
      key: 'distributeDate',
      render: (text: string) => text ? moment(text).format('YYYY-MM-DD') : '---',
    },
    {
      title: '核销时间',
      dataIndex: 'destroyDate',
      key: 'destroyDate',
      render: (text: string) => text ? moment(text).format('YYYY-MM-DD') : '---',
    },
    {
      title: '核销用户',
      dataIndex: 'username',
      key: 'username',
      render: (text: any, record: any) =>
        // console.log(record, 'recordrecord');
        record.userInfo ? record.userInfo.username : ''
      ,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: any, record: any) => record.userInfo ? record.userInfo.mobile : ''
      ,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: any, record: any) => record.userInfo ? record.userInfo.email : '',
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
      width: 90,
      fixed: 'right',
      render: (text: any, record: any) => (<Dropdown
        disabled={record.status === 2}
        overlay={<Menu>
          {
            record.status === 0
              ? (<Menu.Item>
                <a onClick={() => updateStatus([record.code], 1)}>
                  已分发
                </a>
              </Menu.Item>)
              : null
          }

          {
            record.status === 1
              ? (<Menu.Item>
                <a onClick={() => updateStatus([record.code], 0)}>
                  未分发
                </a>
              </Menu.Item>)
              : null
          }
        </Menu>}>
        <Button
          style={{ padding: 0 }}
          type="link"
          disabled={record.status === 2}
        >更改状态</Button>
      </Dropdown>),
    },
  ];

  const rowSelection: TableRowSelection<any> = {
    fixed: true,
    selectedRowKeys,
    onChange: (selectedRowKeys1: string[] | number[]) => {
      changeSelectedRowKeys(selectedRowKeys1 as string[]);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status === 2, // Column configuration not to be checked
      // name: record.name,
    }),
  };

  const onChange = (value: number | undefined) => {
    changeCreateQuantity(value || 10);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => updateStatus(selectedRowKeys, 1)}>
          已分发
        </a>
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item>
        <a onClick={() => updateStatus(selectedRowKeys, 0)}>
          未分发
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.normal}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon="plus"
          onClick={() => changeModalVisible(true)}
        >批量生成邀请码</Button>
      </div>
      <div style={{ padding: '8px 0' }}>
        <span>已选中 {selectedRowKeys.length} 条</span>
        <Dropdown
          overlay={selectedRowKeys.length === 0 ? <></> : menu}>
          <Button
            type="link"
            disabled={selectedRowKeys.length === 0}
          >批量更改状态</Button>
        </Dropdown>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={dataSource || []}
        // @ts-ignore
        columns={columns}
        rowKey="code"
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
                // setCurrent(1);
                changePage({ pageSize: size });
              }}
              total={total}
              pageSizeOptions={['10', '20', '30', '40', '50']}
            />
          </div>)
          : null
      }

      <Modal
        title="批量生成邀请码"
        visible={modalVisible}
        onOk={batchCreate}
        onCancel={() => changeModalVisible(false)}
        okText="生成"
      >
        <InputNumber
          min={1}
          max={50}
          value={createQuantity}
          onChange={onChange}
        />
      </Modal>
    </div>
  );
}

export default connect(
  ({ inviteCode }: ConnectState) => ({
    dataSource: inviteCode.dataSource,
    total: inviteCode.total,
    pageSize: inviteCode.pageSize,
    current: inviteCode.current,
    status: inviteCode.status,
    selectedRowKeys: inviteCode.selectedRowKeys,
    modalVisible: inviteCode.modalVisible,
    createQuantity: inviteCode.createQuantity,
  }),
  {
    handleDataSource: () => ({
      type: 'inviteCode/handleDataSource',
    }),
    changePage: (payload: { pageSize?: number; current?: number; }) => ({
      type: 'inviteCode/changePage',
      payload,
    }),
    changeStatus: (payload: number) => ({
      type: 'inviteCode/changeStatus',
      payload,
    }),
    changeSelectedRowKeys: (payload: string[]) => ({
      type: 'inviteCode/changeSelectedRowKeysStatus',
      payload,
    }),
    updateStatus: (codes: string[], status: number) => ({
      type: 'inviteCode/updateStatus',
      status,
      codes,
    }),
    changeModalVisible: (payload: boolean) => ({
      type: 'inviteCode/changeModalVisibleStatus',
      payload,
    }),
    changeCreateQuantity: (payload: number) => ({
      type: 'inviteCode/changeCreateQuantityStatus',
      payload,
    }),
    batchCreate: () => ({
      type: 'inviteCode/batchCreate',
    }),
  },
)(InviteCode);
