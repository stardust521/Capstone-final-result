import React, {useState, useEffect} from 'react'
import {
    Space, Table, Button, Modal, Form, Input, Radio
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import './index.css';
import {get, post} from "../../util/request";

export default function Administrator() {
    const formRef = React.useRef(null);
    const [userList, setUserList] = useState([])
    const [open, setOpen] = useState(false)
    const onDelete = id => {
        post('/user/delete', {id: id}).then(()=>{
            Modal.success({
                content: 'Delete successfully',
            });
            queryList()
        })
    }
    const columns = [
        {
            title: 'Nick Name',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Faculty',
            dataIndex: 'faculty',
            key: 'faculty'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" danger onClick={()=>{onDelete(record._id)}}>Delete</Button>
                </Space>
            ),
        },
    ];

    const queryList = () => {
        get('/user/list').then(response => {
            setUserList(response.data)
        })
    }
    useEffect(() => {
        queryList()
    }, []);

    const onFinish = (values) => {
        post('/user/register', values).then(response => {
            if(response.data.code === 0) {
                Modal.success({
                    content: response.data.message,
                });
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
            setOpen(false)
            queryList()
        })
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="c-main" style={{overflowY: 'auto'}}>
            <Button type="primary" icon={<PlusCircleOutlined />} style={{ width: 160 }} onClick={() => setOpen(true)} >
                Add New User
            </Button>

            <Table rowKey={record=>record._id} columns={columns} dataSource={userList}/>

            <Modal
                title="User"
                open={open}
                onOk={()=>{
                    formRef.current.submit()
                }}
                onCancel={()=>{
                    setOpen(false)
                }}
            >
                <Form
                    ref={formRef}
                    name="basic"
                    labelCol={{ span: 8, }}
                    wrapperCol={{ span: 16, }}
                    style={{ maxWidth: 600, }}
                    initialValues={{ accountType: 'student', }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Form.Item label="Account Type" name="accountType"
                               rules={[
                                   {
                                       required: true,
                                   },
                               ]}>
                        <Radio.Group>
                            <Radio value="student">student</Radio>
                            <Radio value="tutor">tutor</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Username" name="username"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please input your username!',
                                   },
                               ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please input your password!',
                                   },
                               ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Nick Name" name="nickname"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please input your nick name!',
                                   },
                               ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Faculty" name="faculty"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please input your faculty!',
                                   },
                               ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Bio" name="bio">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
