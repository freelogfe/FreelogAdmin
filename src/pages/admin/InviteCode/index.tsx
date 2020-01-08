import React from 'react';
import {Button, Table, Modal, InputNumber, message, Pagination, Select, Dropdown, Menu} from 'antd';
import moment from 'moment';

import {batchCreate, batchUpdate, selectBetaCodes} from '@/services/admin';

import styles from './index.less';
import {userinfos} from "@/services/user";

export default function () {

  const [dataSource, setDataSource] = React.useState<any[] | null>(null);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [current, setCurrent] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [status, setStatus] = React.useState<number>(-1);
  const [selectedRowKeys, setsSelectedRowKeys] = React.useState<string[]>([]);
  const [createQuantity, setCreateQuantity] = React.useState<number>(10);

  React.useEffect(() => {
    handleData();
  }, [current, pageSize, status]);

  const handleData = async () => {
    const response = await selectBetaCodes({
      page: current,
      pageSize: pageSize,
      status: status,
    });
    if (response.ret !== 0 || response.errcode !== 0) {
      return message.error(response.msg);
    }
    const data = response.data;
    setsSelectedRowKeys([]);
    // setCurrent(data.page);
    // setPageSize(data.pageSize);
    setTotal(data.totalItem);
    setDataSource(data.dataList);

    if (data.totalItem === 0) {
      return;
    }

    const userIds = data.dataList
      .filter((j: any) => j.usedUsers.length > 0)
      .map((i: any) => i.usedUsers[0]);

    // console.log('#######');
    if (userIds.length === 0) {
      return;
    }
    // return;
    // console.log(data.dataList, ' data.dataList');
    const response1 = await userinfos({
      userIds: userIds.join(','),
    });

    if (response1.errcode !== 0 || response1.ret !== 0) {
      return message.error(response1.msg);
    }
    setDataSource(data.dataList.map((i: any) => ({
      ...i,
      userInfo: response1.data.find((j: any) => j.userId === i.usedUsers[0]),
    })));
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
      title: () => {
        return (<Select
          value={status}
          style={{width: 100}}
          onChange={(value: number) => {
            setCurrent(1);
            setStatus(value);
          }}
        >
          <Select.Option value={-1}>全部状态</Select.Option>
          <Select.Option value={0}>未使用</Select.Option>
          <Select.Option value={1}>已分发</Select.Option>
          <Select.Option value={2}>已核销</Select.Option>
        </Select>);
      },
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
      render: (text: string) => {
        return text ? moment(text).format('YYYY-MM-DD') : '---';
      }
    },
    {
      title: '核销时间',
      dataIndex: 'destroyDate',
      key: 'destroyDate',
      render: (text: string) => {
        return text ? moment(text).format('YYYY-MM-DD') : '---';
      }
    },
    {
      title: '核销用户',
      dataIndex: 'username',
      key: 'username',
      render: (text: any, record: any) => {
        // console.log(record, 'recordrecord');
        return record.userInfo ? record.userInfo.username : '';
      }
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: any, record: any) => {
        // console.log(record, 'recordrecord');
        return record.userInfo ? record.userInfo.mobile : '';
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: any, record: any) => {
        return record.userInfo ? record.userInfo.email : '';
      }
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
      render: (text: any, record: any) => {
        return (<Dropdown
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
            style={{padding: 0}}
            type="link"
            disabled={record.status === 2}
          >更改状态</Button>
        </Dropdown>)
      }
    },
  ];

  const rowSelection = {
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // console.log(selectedRowKeys, 'selectedRowKeys');
      setsSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status === 2, // Column configuration not to be checked
      // name: record.name,
    }),
  };

  const handleOk = async () => {
    const response = await batchCreate({
      quantity: createQuantity,
    });
    if (response.ret !== 0 || response.errcode !== 0) {
      return message.error(response.msg);
    }
    message.success('生成成功');
    setVisible(false);
    if (current === 1) {
      handleData();
    } else {
      setCurrent(1);
    }
    // console.log(response, '#######');
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onChange = (value: number | undefined) => {
    setCreateQuantity(value || 10);
  };

  const updateStatus = async (codes: string[], status: number) => {
    const response = await batchUpdate({
      codes,
      status,
    });
    if (response.ret !== 0 || response.errcode !== 0) {
      return message.error(response.msg);
    }
    message.success('修改状态成功');
    handleData();
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
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          type="primary"
          icon="plus"
          onClick={() => setVisible(true)}
        >批量生成邀请码</Button>
      </div>
      <div style={{padding: '8px 0'}}>
        <span>已选中 {selectedRowKeys.length} 条</span>
        <Dropdown
          overlay={menu}>
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
        rowKey={'code'}
        pagination={false}
        scroll={{x: true}}
      />

      {
        total !== 0 ?
          (<div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: 16}}>
            <Pagination
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              showSizeChanger
              current={current}
              onChange={(current: number) => {
                setCurrent(current);
              }}
              pageSize={pageSize}
              onShowSizeChange={(current: number, size: number) => {
                setCurrent(1);
                setPageSize(size);
              }}
              total={total}
              pageSizeOptions={['10', '20', '30', '40', '50']}
            />
          </div>)
          : null
      }

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
          value={createQuantity}
          onChange={onChange}
        />
      </Modal>
    </div>
  );
}
