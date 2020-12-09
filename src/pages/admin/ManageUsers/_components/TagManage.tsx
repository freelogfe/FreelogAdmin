/**
 * component definition: 
 *   for user: provide selections of data filter 
 *   for caller: provide a object which includes all of data to filter    
 * props: tags                          
 */
import React from 'react';
import { Button, Modal, Input } from 'antd';
import { connect } from 'dva';
import Draggable from 'react-draggable';
import { PlusOutlined } from '@ant-design/icons';
const { Search } = Input;

interface tagProps {
  tags: Array<any>;
  visible: boolean;
  createTag(data: string): void;
  showTagMagnge(flag: boolean): void;
}

const TagManage: React.FC<tagProps> = (props) => {
  const { createTag, visible, showTagMagnge } = props;
  const [disabled, setDisabled] = React.useState(false);
  const [tagContent, setTagContent] = React.useState('');

  let onChange = ({ target: { value } }:any) => {
    setTagContent(value);
  };
  let search = (keywords: string) => {
    
  }
  return (
    <Modal
      title={
        <div
          className="w-100x cursor-move"
          onMouseOver={() => {
            disabled && setDisabled(false)
          }}
          onMouseOut={() => {
            setDisabled(true)
          }}
        >
          标签管理
            </div>
      }
      width="75rem"
      className="mt-100"
      visible={visible}
      footer={null}
      onCancel={() => showTagMagnge(false)}
      modalRender={modal => <Draggable disabled={disabled}>{modal}</Draggable>}
    >
      <div className="w-100x h-550 y-auto">
        {/* operation header */}
        <div className="flex-row space-between align-center">
          <div className="flex-row align-center">
            <Input className="w-300" placeholder="输入标签内容" value={tagContent} onChange={onChange}/>
            <Button type="primary" className="ml-10" onClick={()=>createTag(tagContent)}>  
              创建标签
              {/* //icon={<PlusOutlined />} */}
              </Button>
          </div>
          <Search placeholder="请输入标签名称进行搜索" className="w-300" onSearch={search} enterButton allowClear />
        </div>
      </div>
    </Modal>
  );
};

export default connect(({ users }: any) => {
  return ({ 
  })
}, {
  createTag: (data: any) => ({
    type: 'users/postTag',
    payload: data
  }) 
})(TagManage);

