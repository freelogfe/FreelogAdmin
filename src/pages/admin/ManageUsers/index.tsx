import React from 'react';
import moment, { Moment } from 'moment';
import { history, Route, connect } from 'umi';
import { useLocation } from 'react-router-dom';
import { Table, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import Filter from './_components/UsersFilter';
import TagManage from './TagManage';
import styles from './index.less';
import { onCopy } from '@/utils/utils';

interface manageUsersPropsType {
  users: Array<object>;
  getUsers: (data: any) => void;
  deleteUserTag: (data: any) => void;
  addUserTag: (data: any) => void;
  freeze: () => void;
  unfreeze: () => void;
  total: 0;
  tags: Array<object>;
  loading: false
}
function ManageUsers({ users, tags, total, loading, getUsers, deleteUserTag, addUserTag, freeze, unfreeze }: manageUsersPropsType) {
  // 标签路由显示之后 用户管理不显示
  const [visible, setVisible] = React.useState(true);
  const { pathname } = useLocation();
  React.useEffect(() => {
    setVisible(pathname === '/admin/ManageUsers')
  }, [pathname])
  const [filterData, setFilterData] = React.useState({
    skip: 0,
    limit: 10,
    keywords: '',
    tagIds: '',
    startRegisteredDate: '',
    endRegisteredDate: '',
    sort: 1
  });
  // filter开始
  const showTagMagnge = () => {
    history.push({
      pathname: '/admin/ManageUsers/TagManage'
    });
  }
  const selectChange = (sort: number) => {
    setFilterData({ ...filterData, sort })
  }
  const tagChange = (_tag: string | number, checked: boolean) => {
    const tag = _tag + ''
    let tagIds = filterData.tagIds ? filterData.tagIds.split(',') : [];
    if (!tagIds.includes(tag)) {
      if (checked) tagIds.push(tag)
    } else if (!checked) {
      tagIds = tagIds.filter((item) => {
        return item !== tag
      })
    }
    setFilterData({ ...filterData, tagIds: tagIds.join(',') })
  }
  const search = (keywords: string) => {
    setFilterData({ ...filterData, keywords })
  }
  const dateChange = (date: [Moment, Moment], dateString: [string, string]) => {
    setFilterData({ ...filterData, startRegisteredDate: dateString[0], endRegisteredDate: dateString[1] })
  }
  const sortData = [{ id: 1, value: '最近注册' }, { id: 2, value: '资源发布最多' }, { id: 3, value: '展品发布最多' }, { id: 4, value: '消费合约最多' }];
  // filter结束

  // 表格开始

  const showAddModal = () => {

  }
  const userTagClose = (tagId: number, userId: number) => {
    deleteUserTag({tagId, userId}) 
  }
  const columns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      render: (text: String) => <span>{text}</span>,
    },
    // TODO 包装tag组件实现hover才出现X删除
    {
      title: '',
      key: 'tags',
      dataIndex: 'tags',
      render: (_tags: Array<any>, record: any) => (
        <>
          <div className="flex-row">
            {[{tag: 'hgytr2234', tagId: 1}, {tag: 'wwer2234', tagId: 2}, {tag: 'dfgdfg2234', tagId: 3} ].map(tag => {
              return (
                <Tag key={tag.tagId}
                  closable
                  onClose={e => {
                    e.preventDefault();
                    userTagClose(tag.tagId, record.userId);
                  }}>
                  {tag.tag}
                </Tag>
              );
            })}
            <Tag className="site-tag-plus" onClick={showAddModal}>
              <PlusOutlined /> 标签
            </Tag>
          </div>
        </>
      ),
    },
    {
      title: '最近登录',
      dataIndex: 'latestLoginDate',
      key: 'latestLoginDate',
      render: (text: any) => <span>{!text ? moment('2020-11-09T08:44:58.008Z').format("YYYY-MM-DD") : ''}</span>,
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
          <p>{_me[0]} <a className="pl-10" onClick={(e) => { _me[0] && onCopy(_me[0]); return false; }}>{_me[0] ? '复制' : ''}</a></p>
          <p>{_me[1]} <a className="pl-10" onClick={(e) => { _me[1] && onCopy(_me[1]); return false; }}>{_me[1] ? '复制' : ''}</a></p>
        </>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text: any) => <span>{text ? moment(text).format("YYYY-MM-DD") : ''}</span>,
    },
    {
      title: '账号状态',
      key: 'status',
      dataIndex: 'status',
      // 0 Normal, 1 Freeze, 2 BetaTestToBeAudit, 3 BetaTestApplyNotPass 
      render: (text: string, record: any) => (
        <>
          <span className="pr-10">{['正常', '冻结', '测试资格待审核', '测试资格审核未通过'][text]}</span>
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </>
      ),
    },
  ];
  function showTotal() {
    return `Total ${total} items`;
  }
  const pageData = {
    current: (filterData.skip / filterData.limit) + 1,
    pageSize: filterData.limit
  }
  const pageChange = (current: number, pageSize: any) => {
    setFilterData({
      ...filterData,
      skip: (current - 1) * pageSize,
      limit: pageSize
    })
  }
  // 表格结束
  React.useEffect(() => {
    getUsers({ ...filterData })
  }, [filterData]);
  return (
    // TODO 需要默认子路由是用户管理，因为有标签作为子路由，，这里暂时做成覆盖的
    <PageContainer className={styles.normal}>
      <div className={visible ? '' : 'd-none'}>
        <Filter  {...{ tags, sortData, sortSelected: filterData.sort, selectedTags: filterData.tagIds.split(',') }}
          onSearch={search} onSelectChange={selectChange}
          showTagMagnge={showTagMagnge}
          onTagChange={tagChange} onDateChange={dateChange} />
        <Table columns={columns} dataSource={users} loading={!!loading}
          pagination={{ showQuickJumper: true, showSizeChanger: true, current: pageData.current, total, showTotal, onChange: pageChange }} />
      </div>
      {/* <TagManage {...{ tags, visible }} showTagMagnge={showTagMagnge} /> */}
      <Route exact path="/admin/ManageUsers/TagManage" component={TagManage} />
    </PageContainer>
  );
}


export default connect(({ users }: any) => {
  return ({
    users: users.users,
    queryData: users.pagingData,
    total: users.total,
    tags: users.tags,
    loading: users.loading
  })
}, {
  getUsers: (data: any) => ({
    type: 'users/getUsers',
    payload: data
  }),
  deleteUserTag: (data: any) => ({
    type: 'users/deleteUserTag',
    payload: data
  }),
  addUserTag: (data: any) => ({
    type: 'users/addUserTag',
    payload: data
  }),
  freeze: () => ({
    type: 'users/freeze',
  }),
  unfreeze: () => ({
    type: 'users/unfreeze',
  })
})(ManageUsers);


