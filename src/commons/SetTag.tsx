import React from 'react';
import { Modal, Input } from 'antd';
import Draggable from 'react-draggable';

interface tagProps {
    tag: string;
    visible: boolean;
    commit(data: string, visible: boolean): void;
}

const SetTag: React.FC<tagProps> = (props) => {
    const { commit, visible, tag } = props;
    const [disabled, setDisabled] = React.useState(false);
    const [tagContent, setTagContent] = React.useState('');
    React.useEffect(()=>{
      setTagContent(tag);
    }, [tag])
    let handleOk = () => {
        commit(tagContent, true)
    };
    let handleCancel = ({ target: { value } }: any) => {
        commit(tagContent, false)
    };
    let onChange = ({ target: { value } }: any) => {
        setTagContent(value);
    };
    return (
        <Modal
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                        top: 200
                    }}
                    onMouseOver={() => {
                        disabled && setDisabled(false)
                    }}
                    onMouseOut={() => {
                        setDisabled(true)
                    }}
                >
                    创建标签
            </div>
            }
            style={{ top: 200 }}
            mask={false}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            modalRender={modal => <Draggable disabled={disabled}>{modal}</Draggable>}
        >
            <Input  placeholder="输入标签内容" value={tagContent} onChange={onChange} />
        </Modal>
    );
};

export default SetTag;

