/**
 * component definition: 
 *   for user: provide selections of data filter 
 *   for caller: provide a object which includes all of data to filter    
 * props: tags                          
 */
import React from 'react';
import { Select, Tag, Modal, Input } from 'antd';
import Draggable from 'react-draggable';
const { Search } = Input;

interface tagProps {
  tags: Array<any>;
  visible: boolean;
  showTagMagnge(flag: boolean): void;
}

const TagManage: React.FC<tagProps> = (props) => {
  const { tags, visible, showTagMagnge } = props;
  const [disabled, setDisabled] = React.useState(false);
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
        <div className="flex-row space-between">
          <div></div>
          <Search placeholder="请输入标签名称进行搜索" className="w-300" onSearch={search} enterButton  allowClear/>
        </div>
      </div>
    </Modal>
  );
};

export default TagManage;