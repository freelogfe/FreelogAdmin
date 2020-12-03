/**
 * component definition: 
 *   for user: provide selections of data filter 
 *   for caller: provide a object which includes all of data to filter    
 * props: tags                          
 */
import React from 'react';
import { Select, Tag, DatePicker, Input } from 'antd';
const { Option } = Select;
const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;
const { Search } = Input;

interface filterProps {
  tags: Array<string>;
  sortData: Array<{id: number, value: string}>;
  sortSelected: number;
  selectedTags: Array<string>;
  onTagChange(tag: string, checked: boolean): void;
  onSelectChange(value:number):void;
  onSearch(value:string): void;
  onDateChange(dates: any, dateString: [string, string]): void;
}

const Filter: React.FC<filterProps> = (props) => {
  const { tags, onSelectChange, sortData, sortSelected, selectedTags, onTagChange, onSearch, onDateChange } = props;
  return (
    // top and bottom
    <div className="px-10 pb-20">
        {/* top.title sort: left right */}
        <div className="flex-row space-between pb-20">
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
        <div className="flex-row align-center space-between">
          {/* left.tag date */}
          <div className="flex-row align-center">
            <span className="pr-8 shrink-0">标签:</span>
            {tags.map(tag => (
              <CheckableTag
                className="br-samll b-1 d-inline  px-8 py-4"
                key={tag}
                checked={selectedTags.indexOf(tag) > -1}
                onChange={checked => onTagChange(tag, checked)}
              >
                {tag}
              </CheckableTag>
            ))}
            <div><RangePicker onChange={onDateChange}/></div>
          </div>
          {/* right */}
          <div >
           <Search placeholder="用户名/邮箱/手机号" className="w-300" onSearch={onSearch} enterButton  allowClear/>
          </div>
        </div>
    </div>
  );
}; 

export default Filter;