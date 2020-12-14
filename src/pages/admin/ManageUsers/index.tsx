import React from 'react';
import moment, { Moment } from 'moment';
import { history, Route, connect } from 'umi';
import { useLocation } from 'react-router-dom';
import { Table, Tag, Space, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import Filter from './_components/UsersFilter';
import TagManage from './TagManage';
import SetTag from '@/commons/SetTag';

import styles from './index.less';
import { onCopy } from '@/utils/utils';
import { FilterDataType } from './model'

interface manageUsersPropsType {
  users: Array<object>;
  getUsers: (data: any) => void;
  deleteUserTag: (data: any) => void;
  addUserTag: (data: any) => void;
  saveFilterData: (data: any) => void;
  freeze: () => void;
  unfreeze: () => void;
  total: 0;
  tags: Array<object>;
  loading: false,
  filterData: FilterDataType
}
const { confirm } = Modal;

function ManageUsers({ users, tags, total, loading, getUsers, deleteUserTag, filterData, saveFilterData, addUserTag, freeze, unfreeze }: manageUsersPropsType) {
  // 标签路由显示之后 用户管理不显示
  const [visible, setVisible] = React.useState(true);
  const { pathname } = useLocation();
  React.useEffect(() => {
    setVisible(pathname === '/admin/ManageUsers')
  }, [pathname])
  // filter开始
  const showTagMagnge = () => {
    history.push({
      pathname: '/admin/ManageUsers/TagManage'
    });
  }
  const selectChange = (sort: number) => {
    saveFilterData({ ...filterData, sort })
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
    saveFilterData({ ...filterData, tagIds: tagIds.join(',') })
  }
  const search = (keywords: string) => {
    saveFilterData({ ...filterData, keywords })
  }
  const dateChange = (date: [Moment, Moment], dateString: [string, string]) => {
    saveFilterData({ ...filterData, startRegisteredDate: dateString[0], endRegisteredDate: dateString[1] })
  }
  const sortData = [{ id: 1, value: '最近注册' }, { id: 2, value: '资源发布最多' }, { id: 3, value: '展品发布最多' }, { id: 4, value: '消费合约最多' }];
  // filter结束

  // 表格开始
  const [tagSetVisible, setTagSetVisible] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState({ tags: [] ,userId:''});
  React.useEffect(() => {
    setVisible(pathname === '/admin/ManageUsers')
  }, [pathname])
  const showAddModal = (flag: boolean, user: any) => {
    setTagSetVisible(!!flag)
    setSelectedUser(user)
  }
  const setUserTag = (data: Array<any>, visible: boolean) => {
    if(visible) {
      let tagIds:Array<number> = []
      let newTags = data.filter((item: any) => {item.tagId && tagIds.push(item.tagId);  return !item.tagId}).map((item: any)=>item.tag)
      addUserTag({userId: selectedUser.userId, newTags, tagIds })
    }
    // TODO 建立一个变量用于判断请求失败, 失败则不隐藏
    setTagSetVisible(false)
  }
  const userTagClose = (tagId: number, userId: number) => {
    deleteUserTag({ tagId, userId })
  }
  const opertaions = (data: any, type: number)=>{
    let tips = ['确定冻结此账号?','确定恢复此账号']
    confirm({
      title: tips[type],
      icon: <ExclamationCircleOutlined />,
      content: '',
      style: {top: 200},
      onOk() {
      },
      onCancel() {
      },
    });
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
            {_tags.map(tag => {
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
            <Tag className="site-tag-plus" onClick={() => showAddModal(true, record)}>
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
    saveFilterData({
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
        <SetTag visible={tagSetVisible} selectedTags={ selectedUser.tags } tags={tags} commit={setUserTag} />
      </div>
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
    loading: users.loading,
    filterData: users.filterData
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
  }),
  saveFilterData: (data: FilterDataType) => ({
    type: 'users/saveFilterData',
    payload: data
  })
})(ManageUsers);


