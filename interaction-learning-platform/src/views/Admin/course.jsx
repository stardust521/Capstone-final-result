import React, {useState, useEffect} from 'react'
import {
    Space, Table, Button, Modal, Form, Select,Input,Upload,message
} from 'antd';
import { PlusCircleOutlined,UploadOutlined } from '@ant-design/icons';
import './index.css';
import {get, post} from "../../util/request";

export default function Administrator() {
    const formRef = React.useRef(null);
    const [courseList, setCourseList] = useState([])
    const [tutorOptions, setTutorOptions] = useState([])
    const [open, setOpen] = useState(false)
    const [courseId, setCourseId] = useState()
    const [coverImg, setCoverImg] = useState()

    const onDelete = id => {
        post('/course/delete', {id: id}).then(()=>{
            Modal.success({
                content: 'Delete successfully',
            });
            queryList()
        })
    }

    const onSetTutor = id => {
        setOpen(true)
        setCourseId(id)
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'cover_img',
            key: 'cover_img',
            render: (_, record) => {
                return <img style={{width: 100}} src={'http://localhost:3001/' + _}/>
            }
        },
        {
            title: 'Course Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Tutor Name',
            dataIndex: 'tutor_name',
            key: 'tutor_name'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {/*<Button size="small" type="primary" onClick={()=>{onSetTutor(record._id)}}>Update</Button>*/}
                    <Button size="small" danger onClick={()=>{onDelete(record._id)}}>Delete</Button>
                </Space>
            ),
        },
    ];

    const queryList = () => {
        get('/course/list').then(response => {
            const obj = response.data.map(x=>{
                x.tutor_name = x.tutor.nickname
                return x
            })
            setCourseList(obj)
        })
    }
    const queryTutorList = () => {
        get('/user/tutor/list').then(response => {
            const options = response.data.map(x=>{
                return {
                    value: x._id,
                    label: x.nickname
                }
            })
            setTutorOptions(options)
        })
    }

    useEffect(() => {
        queryList()
        queryTutorList()
    }, []);

    const onTutorNameChange = () => {

    }

    const onFinish = (values) => {
        post('/course/update', {
            tutor_user_id: values.tutor_user_id,
            cover_img: coverImg,
            name: values.name,
            description: values.description,
            course_id: courseId
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
            setOpen(false)
            queryList()
        })
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const uploadOptions = {
        name: 'cover_img',
        action: 'http://localhost:3001/upload',
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                setCoverImg(info.file.name)
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div className="c-main" style={{overflowY: 'auto'}}>
            <Button type="primary" icon={<PlusCircleOutlined />} style={{ width: 160 }} onClick={() => setOpen(true)} >
                Add New Course
            </Button>

            <Table rowKey={record=>record._id} columns={columns} dataSource={courseList}/>

            <Modal
                title="Base Course Information"
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
                    labelCol={{ span: 6, }}
                    wrapperCol={{ span: 16, }}
                    style={{ maxWidth: 600, }}
                    initialValues={{ accountType: 'student', }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Form.Item label="Course Name" name="name"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please input name!',
                                   },
                               ]} >
                        <Input />
                    </Form.Item>
                    <Form.Item name="tutor_user_id" label="Course tutor" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select a tutor"
                            onChange={onTutorNameChange}
                            options={tutorOptions}
                            allowClear>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Image" name="cover_img"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please input name!',
                                   },
                               ]} >
                        <Upload {...uploadOptions}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
