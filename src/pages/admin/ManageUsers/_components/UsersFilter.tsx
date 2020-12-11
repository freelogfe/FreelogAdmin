/**
 * component definition: 
 *   for user: provide selections of data filter 
 *   for caller: provide a object which includes all of data to filter    
 * props: tags                          
 */
import React from 'react';
import { Select, Tag, DatePicker, Input } from 'antd';
import {
  SettingOutlined
} from '@ant-design/icons';
const { Option } = Select;
const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;
const { Search } = Input;

interface filterProps {
  tags: Array<any>;
  sortData: Array<{ id: number, value: string }>;
  sortSelected: number;
  selectedTags: Array<string>;
  onTagChange(tag: string, checked: boolean): void;
  onSelectChange(value: number): void;
  onSearch(value: string): void;
  onDateChange(dates: any, dateString: [string, string]): void;
  showTagMagnge(flag: boolean): void;
}

const Filter: React.FC<filterProps> = (props) => {
  const { tags, onSelectChange, sortData, sortSelected, selectedTags, onTagChange, onSearch, onDateChange, showTagMagnge } = props;

  return (
    // top and bottom
    <div className="px-10 pb-20">
      {/* top.title sort: left right */}
      <div className="flex-row space-between pb-20 d-none">
        {/* left.title */}
        <div className="fs-20 fw-bold"></div>
        {/* right.sort */}
        <div className="flex-row align-center">
          <span className="fs-16" >排序：</span>
          <Select defaultValue={sortSelected} style={{ width: 220 }} onSelect={onSelectChange}>
            {
              sortData.map((item, index) => {
                return <Option key={item.id} value={item.id}>{item.value}</Option>
              })
            }
          </Select>
        </div>
      </div>
      {/* bottom:left  right */}
      <div className="flex-row align-center space-between flex-wrap">
        {/* left.tag date */}
        <div className="flex-row align-center  space-between align-center">
          <div className="flex-row align-center "> 
            <div className="flex-row align-center flex-wrap">
              <span className="pr-8 shrink-0">标签:</span>
              {tags.map((tag: any) => (
                <CheckableTag
                  className="br-samll b-1 d-inline  px-8 py-4 my-4"
                  key={tag.tagId}
                  checked={selectedTags.indexOf(tag.tagId + '') > -1}
                  onChange={checked => onTagChange(tag.tagId, checked)}
                >
                  {tag.tag}
                </CheckableTag>
              ))}
            </div>
            
            <div className="flex-row align-center px-20 cursor-pointer shrink-0"
              onClick={() => showTagMagnge(true)}>
              <SettingOutlined />
              <div className="fc-blue fs-14 px-5 shrink-0" >管理标签</div>
            </div>
          </div>
          <div className="shrink-0"><RangePicker onChange={onDateChange} /></div>
        </div>
        {/* right */}
        <div className="flex-1 flex-row align-center justify-end ">
          <Search placeholder="用户名/邮箱/手机号" className="w-300 self-end" onSearch={onSearch} enterButton allowClear onPressEnter={(e) => onSearch(e.currentTarget.value)} />
        </div>
      </div>
    </div>
  );
};

export default Filter;