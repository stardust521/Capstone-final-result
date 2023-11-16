import {Button, Rate, DatePicker, Form, Input, Modal, message} from 'antd'
import React, {useEffect, useState} from 'react'
import { get, getLoginUser, post } from '../../util/request'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [score, setScore] = useState(3)
    const [user, setUser] = useState({
        nickname: '',
        faculty: '',
        bio: '',
        likes: 'Football',
        timezones: 'USC',
        reserve: [new Date('2023-10-23 10:00:00'), new Date('2023-10-24 10:00:00')],
    })
    const [studyList, setStudyList] = useState([])
    const updateForm = (u) => {
        const data = {
            ...u,
            likes: 'Football',
            timezones: 'USC',
            reserve: [new Date('2023-10-23 10:00:00'), new Date('2023-10-24 10:00:00')],
        }
        setUser(data)
        form.setFieldsValue(data);
    }

    useEffect(() => {
        const user = getLoginUser()

        updateForm(user)
        setAvatar(user.avatar)

        // search current user's booking
        get('/booking/list', {
            user_id: user._id,
            user_type: user.type,
        }).then(resp => {
            setStudyList(resp.data)
        })
    }, []);

    const submitScore = () => {
        post('/booking/rate', {
            booking_id: currentRateCourseId,
            score: score
        }).then(() => {
            message.info('Rating Success')
            setOpen(false)
        })
    }

    const onFinish = (values) => {
        if (isEdit) {
            const data = {
                ...values,
                userId: user._id,
                avatar,
            }
            post('/user/update', data).then(response => {
                localStorage.setItem("login_user", JSON.stringify(response.data.user))

                updateForm(data)
                Modal.success({
                    content: response.data.message,
                });
                navigate(`/home`)
            })
        }
        setIsEdit(!isEdit)
    }
    const onFinishFailed = (values) => {
    }
    const [open, setOpen] = useState(false)
    const [currentRateCourseId, setCurrentRateCourseId] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const [avatar, setAvatar] = useState()
    const [avatarList] = useState(['1.png', '2.png', '3.png', '4.png',])

    let other1;
    if (user.type === 'student') {
        other1 = <Form.Item
            label="Likes"
            name="like"
            rules={[{required: false, message: 'Please input your likes!'}]}>
            {isEdit ? <Input/> : <span>{user.like}</span>}
        </Form.Item>
    } else {
        other1 = <Form.Item
            label="Specialized skill"
            name="like"
            rules={[
                {required: false, message: 'Please input your specialized skill!'},
            ]}
        >
            {isEdit ? <Input/> : <span>{user.like}</span>}
        </Form.Item>
    }

    let other2;
    if (user.type === 'student') {
        other2 = <Form.Item label="Study Course List">
            {studyList.map((item, i) => {
                return (
                    <div key={i} style={{display: 'flex', marginBottom: 10}}>
                        <span style={{flex: 1, color: '#c21c2b'}}>
                          {item.course_name}
                            <Rate defaultValue={item.score}/>
                        </span>
                        <Button onClick={() => {
                            setOpen(true);
                            setCurrentRateCourseId(item._id)
                            setScore(item.score)
                        }} type="primary">
                            Rating
                        </Button>
                    </div>
                )
            })}
        </Form.Item>
    } else {
        other2 = <Form.Item label="Rating List">
            {studyList.map((item, i) => {
                return (
                    <div key={i} style={{display: 'flex', marginBottom: 10}}>
                        <span style={{flex: 1}}>{item.course_name}</span>
                        <Rate value={item.score} type="primary"></Rate>
                    </div>
                )
            })}
        </Form.Item>
    }

    return (
        <div
            style={{
                backgroundColor: '#fff',
                marginLeft: 20,
                padding: 20,
                borderRadius: 5,
                width: '100%',
                height: '100%',
                overflow: 'auto',
                // maxWidth: 600,
            }}
        >
            <div style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>
                Profile
            </div>
            <Form
                form={form}
                name="basic"
                layout={'vertical'}
                initialValues={user}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off">
                <div style={{display: 'flex'}}>
                    <Form.Item label="" rules={[{required: false, message: 'Please input your name!'}]}>
                        <img style={{width: 80, height: 80, borderRadius: 80}} src={'/image/' + avatar}/>

                        {isEdit && (
                            <div
                                style={{
                                    backgroundColor: '#f5f3ff',
                                    padding: 10,
                                    borderRadius: 10,
                                    marginTop: 10,
                                }}>
                                <div style={{display: 'flex', gap: 10}}>
                                    {avatarList.map((item) => {
                                        return (
                                            <img
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 80,
                                                    cursor: 'pointer',
                                                }}
                                                src={'/image/' + item}
                                                onClick={() => {
                                                    setAvatar(item)
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Nick Name"
                        name="nickname"
                        style={{marginLeft: 20, flex: 1}}
                        rules={[{required: false, message: 'Please input your name!'}]}>
                        {isEdit ? <Input/> : <span>{user.nickname}</span>}
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        {!isEdit ? 'Edit' : 'Save'}
                    </Button>
                </div>

                <Form.Item
                    label="Faculties"
                    name="faculty"
                    rules={[{required: false, message: 'Please input your faculties!'}]}>
                    {isEdit ? <Input/> : <span>{user.faculty}</span>}
                </Form.Item>

                <Form.Item
                    label="Profile"
                    name="bio"
                    rules={[{required: false, message: 'Please input your profile!'}]}>
                    {isEdit ? <Input/> : <span>{user.bio}</span>}
                </Form.Item>
                {other1}
                <Form.Item
                    label="Time zones"
                    name="timezones"
                    rules={[
                        {required: false, message: 'Please input your time zones!'},
                    ]}>
                    {isEdit ? <Input/> : <span>{user.timezones}</span>}
                </Form.Item>
                <Form.Item
                    label="Reserve time"
                    rules={[
                        {required: false, message: 'Please input your time reserve!'},
                    ]}
                >
                    {isEdit ? (
                        <DatePicker.RangePicker showTime/>
                    ) : (
                        <span>{user.reserve.toString()}</span>
                    )}
                </Form.Item>
                {other2}
            </Form>
            <Modal
                open={open}
                onOk={submitScore}
                onCancel={() => {
                    setOpen(false)
                }}
            >
                <div>
                    <div style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>
                        Rating
                    </div>
                    <Form
                        name="basic"
                        layout={'vertical'}
                        initialValues={{content: ''}}
                        onFinish={() => {
                        }}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Form.Item label="Rating" name="rating">
                            <Rate onChange={setScore} value={score} defaultValue={3}/>
                        </Form.Item>
                        <Form.Item label="Content" name="content">
                            <Input/>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
