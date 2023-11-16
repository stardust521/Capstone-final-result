import {
    Button,
    Form,
    Input,
    Modal,
    Col,
    Row,
} from 'antd'

import React, {useState} from 'react'
import {get, getLoginUser, post} from '../../util/request'

export default function ResetPwd() {

    const onFinish = (values) => {
        const user = getLoginUser()
        post('/user/reset/password', {
            userId: user._id,
            password: values.password
        }).then(response => {
            if(response.data.code === 0) {
                Modal.success({
                    content: response.data.message,
                });
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
                marginTop: 10,
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
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">

                        <Form.Item label="New Password" name="password"
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
