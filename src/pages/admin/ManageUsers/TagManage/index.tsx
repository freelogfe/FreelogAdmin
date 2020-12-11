import React from 'react';
import { Button, Modal, Input, Table, Space } from 'antd';
import { connect } from 'umi';
import AddTag from '@/commons/AddTag';
import { PlusOutlined, ExclamationCircleOutlined, DeleteOutlined, DeleteTwoTone, EditOutlined } from '@ant-design/icons';

const { Search } = Input;
const { confirm } = Modal;

interface tagProps {
  tags: Array<any>;
  addTag(data: string): void;
  deleteTag(tagId: number): void;
  updateTag(tag: any): void;
}

const TagManage: React.FC<tagProps> = (props) => {
  const { tags, addTag, deleteTag, updateTag } = props;
  const [visible, setVisible] = React.useState(false);
  const [tag, setTag] = React.useState(null);
  const [tableData, setTableData] = React.useState([...tags]);
  const search = (keywords: string) => {
    setTableData(tags.filter((item) => {
      return item.tag.indexOf((keywords + '').toLocaleLowerCase()) > -1
    }))
  }
  React.useEffect(() => {
    setTableData([...tags])
  }, [tags])
  const tagConfirm = (data: string, flag: boolean) => {
    if (flag) {
      if(tag){
        updateTag({tagId: tag.tagId, tag: data})
      }else{
        addTag(data)
      } 
    }
    setVisible(false)
  }
  const showModal = (tag?: any) => {
    if (tag) {
      setTag({ ...tag })
    } else {
      setTag(null)
    }
    setVisible(true)
  }
  const showConfirm = (tag: any) => {
    confirm({
      title: '确定删除这个标签?',
      icon: <ExclamationCircleOutlined />,
      content: tag.tag,
      style: {top: 200},
      onOk() {
        deleteTag(tag.tagId)
      },
      onCancel() {
      },
    });
  }
  const columns = [
    {
      title: '标签名',
      dataIndex: 'tag',
      width: 280,
      key: 'tag'
    },
    {
      title: '',
      key: 'totalSetCount',
      dataIndex: 'totalSetCount',
      // 0 Normal, 1 Freeze, 2 BetaTestToBeAudit, 3 BetaTestApplyNotPass 
      render: (text: string, record: any) => (
        <>
          <span className="fc-less">{record.totalSetCount} 用户 •  {record.type === 1 ? '手动标签' : '自动标签'}</span>
        </>
      ),
    },
    {
      title: '操作',
      key: 'status',
      dataIndex: 'operation',
      width: 180,
      // 0 Normal, 1 Freeze, 2 BetaTestToBeAudit, 3 BetaTestApplyNotPass 
      render: (text: string, record: any) => (
        <>
          <Space size="middle">
            <a onClick={(e) => { showModal(record); return false; }}>编辑</a>
            <a onClick={(e) => { showConfirm(record); return false; }}>删除</a>
          </Space>
        </>
      ),
    }
  ];
  // const rowSelection = {
  //   onChange: (selectedRowKeys: any, selectedRows: any) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   getCheckboxProps: (record: any) => ({
  //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //     name: record.name,
  //   }),
  // };
  return (
    <div className="p-absolute lt-0 w-100x h-100x bg-main">
      {/* operation header */}
      <div className="flex-row space-between align-center mb-20">
        <div className="flex-row align-center">
          <Button type="primary" className="ml-10" onClick={() => showModal()} icon={<PlusOutlined />}>
            创建标签
              {/* //icon={<PlusOutlined />} */}
          </Button>
        </div>
        <Search placeholder="请输入标签名称进行搜索" className="w-300" onSearch={search} onPressEnter={(e) => search(e.currentTarget.value)} enterButton allowClear />
      </div>
      <Table
        // rowSelection={{
        //   type: 'checkbox',
        //   ...rowSelection,
        // }}
        rowKey={record => { return record.tagId }}
        columns={columns}
        dataSource={tableData}
      />
      <AddTag tag={tag ? tag.tag : ''} commit={tagConfirm} visible={visible} />
    </div>
  );
};

export default connect(({ users }: any) => {
  return ({
    tags: users.tags,
  })
}, {
  addTag: (data: any) => ({
    type: 'users/addTag',
    payload: data
  }),
  deleteTag: (data: any) => ({
    type: 'users/deleteTag',
    payload: data
  }),
  updateTag: (data: any) => ({
    type: 'users/updateTag',
    payload: data
  }),
})(TagManage);

