import {
    Button,
    Form,
    Input,
    Modal,
    Col,
    Row,
    Radio,
} from 'antd'

import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {get, post} from '../../util/request'

export default function Register() {
    const navigate = useNavigate()

    const onFinish = (values) => {
        post('/user/register', values).then(response => {
            if(response.data.code === 0) {
                Modal.success({
                    content: response.data.message,
                });
                navigate(`/`)
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
        })
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div
            style={{
                marginTop: 100,
                padding: 20,
                width: '100%',
                height: '100%',
                overflow: 'auto',
            }}
        >
            <Row>
                <Col span={12} offset={6}>

                    <Form
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
                            ]}
                        >
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
                                {
                                    min: 8,
                                    message: 'Password length must be >= 8',
                                },
                                {
                                    pattern: new RegExp(/[0-9]+/, 'g'),
                                    message: 'Password must include 0-9 characters'
                                },
                                {
                                    pattern: new RegExp(/[a-zA-Z]+/, 'g'),
                                    message: 'Password must include a-z or A-Z characters'
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

                        <Form.Item label="Like" name="like"
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Please input your like!',
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

                        <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </div>
    )
}
