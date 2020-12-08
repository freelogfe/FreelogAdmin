import React from 'react';

import styles from './index.less';
import { connect } from 'dva';
import { Table, Tag } from 'antd';
import Filter from './_components/filter'
import { Moment } from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
interface manageUsersPropsType {
  users: Array<object>;
  getUsers: (data: any) => void;
  deleteTag: () => void;
  addTag: () => void;
  freeze: () => void;
  unfreeze: () => void;
  total: 0;
} 
function ManageUsers({ users,total, getUsers, deleteTag, addTag, freeze, unfreeze }: manageUsersPropsType) {
  // filter开始
  const [sortSelected, setSortSelected] = React.useState(1);
  const [selectedTags, setSelectedTags] = React.useState(['cool']);
  let selectChange = (data: number) => {
    setSortSelected(data)
  }
  let tagChange = (tag: string, checked: boolean) => {
    let data = [...selectedTags]
    if (!selectedTags.includes(tag)) {
      checked && data.push(tag)
    } else {
      if (!checked) {
        data = selectedTags.filter((item) => {
          return item !== tag
        })
      }
    }
    setSelectedTags(data)
  }
  let search = (value: string) => {
    console.log(value)
  }
  let dateChange = (date: [Moment, Moment], dateString: [string, string]) => {
    console.log(date, dateString)
  }
  let tags = ['cool', 'teacher', 'loser', 'nice', 'developer']
  let sortData = [{ id: 1, value: '最近注册' }, { id: 2, value: '资源发布最多' }, { id: 3, value: '展品发布最多' }, { id: 4, value: '消费合约最多' }];
  // filter结束

  // 表格开始
  const columns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      render: (text: String) => <span>{text}</span>,
    }, 
    {
      title: '最近登录',
      dataIndex: 'latestLoginDate',
      key: 'latestLoginDate',
      render: (text: any) => <span>{!text? moment('2020-11-09T08:44:58.008Z').format("YYYY-MM-DD") : ''}</span>,
    }, 
    {
      title: '发布资源数',
      dataIndex: 'createdResourceCount',
      key: 'createdResourceCount',
      render: (text: String) => <span>{text}</span>,
    }, 
    {
      title: '运营节点数',
      dataIndex: 'createdNodeCount',
      key: 'createdNodeCount',
      render: (text: String) => <span>{text}</span>,
    }, 
    {
      title: '消费合约数',
      dataIndex: 'signedContractCount',
      key: 'signedContractCount',
      render: (text: String) => <span>{text}</span>,
    }, 
    {
      title: '注册手机号/邮箱',
      dataIndex: '_me',
      key: '_me',
      render: (_me: Array<any>) => (
        <>
          <p>{_me[0]}</p>
          <p>{_me[1]}</p>
        </>
      ),
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: Array<any>) => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text: any) => <span>{text? moment(text).format("YYYY-MM-DD") : ''}</span>,
    }, 
    {
      title: '账号状态',
      key: 'status',
      dataIndex: 'status',
      // 0 Normal, 1 Freeze, 2 BetaTestToBeAudit, 3 BetaTestApplyNotPass 
      render: (text: string, record: any) => (
        <>
          <span className="pr-10">{['正常','冻结','测试资格待审核','测试资格审核未通过'][text]}</span>
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </>
      ),
    },
  ];
  const [pageData, setPageData] = React.useState({
    current: 1,
    pageSize: 10
  });

  function showTotal() {
    return `Total ${total} items`;
  }
  let pageChange = (current: number, pageSize: any) =>  {
     setPageData({current, pageSize})
     getUsers({current, pageSize})
  }
  // 表格结束
  React.useEffect(() => {
    getUsers({});
  }, []);
  return (
    <PageContainer className={styles.normal}>
      <Filter  {...{ tags, sortData, sortSelected, selectedTags }}
        onSearch={search} onSelectChange={selectChange}
        onTagChange={tagChange} onDateChange={dateChange}></Filter>
      <Table columns={columns} dataSource={users} loading={!users.length} 
             pagination={{ showQuickJumper: true, current: pageData.current, pageSize: pageData.pageSize, total: total, showTotal: showTotal,onChange: pageChange }}  />
    </PageContainer>
  );
}


export default connect(({ users }: any) => {
  return ({
  users: users.users,
  queryData: users.pagingData,
  total: users.total
})}, {
  getUsers: (data: any) => ({
    type: 'users/getUsers',
    payload: data
  }),
  deleteTag: () => ({
    type: 'users/deleteTag',
  }),
  addTag: () => ({
    type: 'users/addTag',
  }),
  freeze: () => ({
    type: 'users/freeze',
  }),
  unfreeze: () => ({
    type: 'users/unfreeze',
  })
})(ManageUsers);


