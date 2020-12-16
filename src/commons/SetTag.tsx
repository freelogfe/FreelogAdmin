import React from 'react';
import { Modal, Input, Tag, message } from 'antd';
import Draggable from 'react-draggable';
const { CheckableTag } = Tag;

interface tagProps {
    selectedTags: Array<any>;
    tags: Array<any>;
    visible: boolean;
    // data 是数组，含有选中的标签和新添加的标签，丢给父组件自己过滤识别
    commit(data: Array<any>, visible: boolean): void;
}
interface Tag {
    tagId: number | undefined;
    tag: string;
    [propName: string]: any;
}
// TODO 进来渲染好就固定高度，否则影响体验
const SetTag: React.FC<tagProps> = (props) => {
    const { commit, visible, tags, selectedTags } = props;
    const [disabled, setDisabled] = React.useState(true);
    const [tagContent, setTagContent] = React.useState('');
    const [setTags, setSetTags] = React.useState<Array<Tag>>([...selectedTags]);
    React.useEffect(() => {
        setSetTags([...selectedTags])
    }, [selectedTags])
    const onTagCheck = (tag: Tag, checked: boolean) => {
        if (!checked) {
            setSetTags(setTags.filter((tagItem: Tag) => {
                return (tagItem.tagId && tagItem.tagId !== tag.tagId) || (!tagItem.tagId && tagItem.tag !== tag.tag)
            }))
        } else {
            setSetTags([...setTags, { ...tag }])
        }
    }
    let handleOk = () => {
        commit(setTags, true)
    };
    let handleCancel = ({ target: { value } }: any) => {
        commit(setTags, false)
    };
    let onChange = (e: any) => {
        if ([32, 13].includes(e.keyCode)) {
            if (!setTags.map((item: Tag) => item.tag).includes(e.target.value.trim())) {
                setSetTags([...setTags, { tagId: undefined, tag: e.target.value.trim() }])
            } else {
                message.warn('已存在');
            }
            setTagContent('');
        } else {
            setTagContent(e.target.value);
        }
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
                    className="fs-16 fc-less fw-bold"
                    onMouseOver={() => {
                        disabled && setDisabled(false)
                    }}
                    onMouseOut={() => {
                        setDisabled(true)
                    }}
                >
                    添加标签
            </div>
            }
            style={{ top: 300, left: 200 }}
            mask={false}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            modalRender={modal => <Draggable disabled={disabled}>{modal}</Draggable>}
        >
            <div className="br-samll b-1 p-10 mb-10">
                <div className="mb-5">
                    {setTags.map((tag: Tag, index: number) => (
                        <Tag key={index}
                            closable
                            className="mb-10"
                            onClose={e => {
                                e.preventDefault();
                                onTagCheck(tag, false);
                            }}>
                            {tag.tag}
                        </Tag>
                    ))}
                </div>
                <Input placeholder="请选择下面标签，或输入标签按回车或空格建确认" className="mt-15 input-none" value={tagContent} onKeyUp={(e) => onChange(e)} onChange={(e) => { setTagContent(e.target.value) }} />
            </div>
            {tags.map((tag: any) => (
                <CheckableTag
                    className="br-samll b-1 d-inline  px-8 py-4 my-4"
                    key={tag.tagId}
                    checked={setTags.map((item: Tag) => item.tagId).includes(tag.tagId)}
                    onChange={checked => onTagCheck(tag, checked)}
                >
                    {tag.tag}
                </CheckableTag>
            ))}
        </Modal>
    );
};

export default SetTag;

