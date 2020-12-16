import React from 'react';
import { Modal, Input, Radio } from 'antd';
import Draggable from 'react-draggable';
const { TextArea } = Input;

interface tagProps {
    visible: boolean;
    commit(data: string, visible: boolean): void;
}

const FreezeUser: React.FC<tagProps> = (props) => {
    const { commit, visible } = props;
    const [disabled, setDisabled] = React.useState(true);
    const [remark, setTagContent] = React.useState('');
    const [radioValue, setRadioValue] = React.useState('');
    React.useEffect(()=>{
        setTagContent('')
        setRadioValue('')
    },[visible])
    const handleOk = () => {
        commit(remark, true)
    };
    const handleCancel = ({ target: { value } }: any) => {
        commit(remark, false)
    };
    const onTextChange = ({ target: { value } }: any) => {
        setTagContent(value);
    };
    const onRadioChange = ({ target: { value } }: any) => {
        setRadioValue(value)
        setTagContent(value);
    };
    let radioData = ['抄袭、侵权', '欺诈', '垃圾广告', '色情、暴力', '不实信息', '恶意操作'];
    return (
        <Modal
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                        top: 200
                    }}
                    className="fs-16 fc-less fw-bold"
                    onMouseOver={() => {
                        disabled && setDisabled(false)
                    }}
                    onMouseOut={() => {
                        setDisabled(true)
                    }}
                >
                    冻结账户
                </div>
            }
            style={{ top: 200 }}
            mask={false}
            okText="冻结"
            visible={visible}
            className="freeze-modal"
            onOk={handleOk}
            onCancel={handleCancel}
            modalRender={modal => <Draggable disabled={disabled}>{modal}</Draggable>}
        >
            <Radio.Group onChange={onRadioChange} value={radioValue}>
                {radioData.map((item: string) =>
                    <Radio className="d-block h-40" value={item} key={item}>
                        {item}
                    </Radio>
                )}
            </Radio.Group>
            <TextArea placeholder="输入标签内容" value={remark} onChange={onTextChange} rows={6} />
        </Modal>
    );
};

export default FreezeUser;

