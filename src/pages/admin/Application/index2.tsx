import React from 'react';
import {message, Table, Button, Pagination, Select, Input, Modal, Radio, Popover} from 'antd';
import moment from 'moment';

import {applyRecords, betaAudit} from '@/services/admin';

import styles from './index.less';
import {searchUser, userinfos} from "@/services/user";

export default function () {

  // const [isMount, setIsMount] = React.useState<boolean>(true);
  const [dataSource, setDataSource] = React.useState<any[] | null>(null);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [current, setCurrent] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [status, setStatus] = React.useState<number>(-1);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [handledRecordIds, setHandledRecordIds] = React.useState<string[]>([]);
  const [auditValue, setAuditValue] = React.useState<number>(1);
  const [otherReasonValue, setOtherReasonValue] = React.useState<string>('');
  // 0 不用限用户 -1 用户不存在 other 用户 id
  const [searchedUserID, setSearchedUserID] = React.useState<number>(0);

  // React.useEffect(() => {
  //   setIsMount(false);
  // }, []);

  React.useEffect(() => {
    handleData();
  }, [current, pageSize, status, searchedUserID]);

  // React.useEffect(() => {
  //   if (!isMount) {
  //     console.log(searchUserValue, 'searchUserValue');
  //     // searchUserID();
  //   }
  // }, [searchUserValue]);

  const handleData = async () => {
    if (searchedUserID === -1) {
      setSelectedRowKeys([]);
      setTotal(0);
      setDataSource([]);
      return;
    }
    const params: any = {
      page: current,
      pageSize: pageSize,
      status: status,
    };
    if (searchedUserID !== 0) {
      params.userId = searchedUserID;
    }
    const response = await applyRecords(params);
    // console.log(response, 'responseresponse');
    if (response.errcode !== 0 || response.ret !== 0) {
      return message.error(response.msg);
    }
    const data = response.data;
    setSelectedRowKeys([]);
    setTotal(data.totalItem);

    if (data.totalItem === 0) {
      return setDataSource([]);
    }

    const response1 = await userinfos({
      userIds: data.dataList.map((i: any) => i.userId).join(','),
    });

    if (response1.errcode !== 0 || response1.ret !== 0) {
      return message.error(response1.msg);
    }
    setDataSource(data.dataList.map((i: any) => ({
      ...i,
      userInfo: response1.data.find((j: any) => j.userId === i.userId),
    })));

  };

  const searchUserID = async (keyword: string) => {
    if (!keyword) {
      return setSearchedUserID(0);
    }
    // setSearchUserValue(keyword);
    const response = await searchUser({
      keywords: keyword,
    });
    if (response.errcode !== 0 || response.ret !== 0) {
      return message.error(response.msg);
    }

    if (response.data) {
      setSearchedUserID(response.data.userId);
    } else {
      setSearchedUserID(-1);
    }
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
      render: (text: string, record: any) => {
        return (<div style={{width: 300, lineHeight: '24px'}}>
          <div>职业：{record.occupation}</div>
          <div>区域：{record.province}-{record.city}</div>
          <div>其它：{record.description}</div>
        </div>)
      }
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
      render: (text: number, record: any) => {
        return (record.userInfo ? record.userInfo.mobile : '');
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: number, record: any) => {
        return (record.userInfo ? record.userInfo.email : '');
      }
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
            return (<Button
              type="link"
              onClick={() => setHandledRecordIds([record.recordId])}
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

  const rowSelection = {
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 0, // Column configuration not to be checked
    }),
  };

  const handleOk = async () => {
    // console.log(handledRecordIds, 'handledRecordIds');
    let status: 1 | 2 = 1;
    let auditMsg: string = '';
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
        auditMsg = otherReasonValue ? otherReasonValue : '其它原因';
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
    const response = await betaAudit({
      recordIds: handledRecordIds,
      status: status,
      auditMsg: auditMsg,
    });
    if (response.errcode !== 0 || response.ret !== 0) {
      return message.error(response.msg);
    }
    setHandledRecordIds([]);
    handleData();
    message.success('修改状态成功');
  };

  const handleCancel = () => {
    setHandledRecordIds([]);
  };

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  return (
    <div className={styles.normal}>
      <div style={{padding: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <span>已选中 {selectedRowKeys.length} 条</span>
          <Button
            type="link"
            disabled={selectedRowKeys.length === 0}
            onClick={() => setHandledRecordIds(selectedRowKeys)}
          >批量审核</Button>
        </div>
        <Input.Search
          onSearch={value => searchUserID(value)}
          placeholder="请输入用户名、注册邮箱/手机号进行搜索"
          enterButton="搜索"
          size="large"
          style={{width: 400}}
        />
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
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
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

      <Modal
        title="审核内测资格"
        visible={handledRecordIds.length !== 0}
        onOk={handleOk}
        onCancel={handleCancel}
        // okText="生成"
      >
        <Radio.Group
          value={auditValue}
          onChange={(e) => setAuditValue(e.target.value)}
        >
          <Radio style={radioStyle} value={1}>通过</Radio>
          <Radio style={radioStyle} value={2}>拒绝通过：链接无法打开</Radio>
          <Radio style={radioStyle} value={3}>拒绝通过：公众号ID不存在</Radio>
          <Radio style={radioStyle} value={4}>拒绝通过：其它原因</Radio>
        </Radio.Group>
        {auditValue === 4
          ? <Input.TextArea
            value={otherReasonValue}
            onChange={(e) => setOtherReasonValue(e.target.value)}
            style={{display: 'block'}}
            placeholder="请输入拒绝通过原因（非必填）"
            rows={4}
          />
          : null}
      </Modal>
    </div>
  );
}
