/**
 * component definition: 
 *   for user: provide selections of data filter 
 *   for caller: provide a object which includes all of data to filter    
 * props: tags                          
 */
import React from 'react';
import { Row, Typography, Col } from 'antd';
const { Title } = Typography;

interface filterProps {
  tags: Array<any>;
  sortData: Array<any>;
  sortSelected: any;
  onSelectChange: Function
}

const Filter: React.FC<filterProps> = (props) => {
  const { tags, onSelectChange, sortData, sortSelected } = props;
//   const [count, setCount] = useState(0);
  return (
    // top and bottom
    <div>
        {/* top.title sort: left right */}
        <div className="flex-row space-between px-20">
          {/* left.title */}
          <div>用户管理</div>
          <div className="flex-row ">
            <span >排序：</span>
            
          </div>
        </div>
    </div>
  );
}; 

export default Filter;