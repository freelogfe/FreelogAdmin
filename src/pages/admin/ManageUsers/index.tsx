import React from 'react';

import styles from './index.less';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Table, Tag } from 'antd';
import Filter from './_components/filter'
import { Moment } from 'moment';

function ManageUsers({ applyRecords, init }: any) {

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: String) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <>
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '4',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '5',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '6',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '7',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '8',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '9',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '10',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '11',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '12',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '13',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '14',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '15',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '16',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '17',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '18',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '19',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    }
  ];
  // console.log(applyRecords, 'applyRecords');
  const [sortSelected, setSortSelected] = React.useState(1);
  const [selectedTags, setSelectedTags] = React.useState(['cool']);
  let selectChange = (data: number) => {
    console.log(data)
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
    console.log(data)
    setSelectedTags(data)
  }
  let search = (value: string) => {
    console.log(value)
  }
  let dateChange = (date: Moment, dateString: [string, string]) => {
    console.log(date)
  }
  React.useEffect(() => {
    init()
  }, []);
  let tags = ['cool', 'teacher', 'loser', 'nice', 'developer']
  let sortData = [{ id: 1, value: '最近注册' }, { id: 2, value: '资源发布最多' }, { id: 3, value: '展品发布最多' }, { id: 4, value: '消费合约最多' }]
  return (
    <div className={styles.normal}>
      <Filter  {...{ tags, sortData, sortSelected, selectedTags }}
        onSearch={search} onSelectChange={selectChange}
        onTagChange={tagChange} onDateChange={dateChange}></Filter>
      <Table columns={columns} dataSource={data} />
      <pre>{JSON.stringify(applyRecords)}</pre>
    </div>
  );
}

export default connect(
  ({ application }: ConnectState) => ({
    applyRecords: application.applyRecords,
  }),
  {
    init: () => ({
      type: 'application/getApplyRecords',
    }),
  },
)(ManageUsers);


