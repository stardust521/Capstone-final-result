import React, {useState, useEffect} from 'react'
import {
    Tag,Space, Table, Button, Modal
} from 'antd';
import './index.css';
import {get, post, getLoginUser} from "../../util/request";

export default function Administrator() {
    const [bookingList, setBookingList] = useState([])
    const user = getLoginUser()

    const onChangeBookingState = (id, state) => {
        post('/booking/updateState', {id, state}).then(()=>{
            Modal.success({
                content: state + ' successfully',
            });
            queryList()
        })
    }

    const renderState = (_, record) => {
        if(record.state === 'reject') {
            return <Tag color="#f50">Reject</Tag>
        }else if(record.state === 'accept') {
            return <Tag color="#87d068">Accept</Tag>
        }else{
            return 'N/A'
        }
    }

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'course_name',
            key: 'course_name'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time'
        },
        {
            title: 'Student Name',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: 'Tutor Name',
            dataIndex: 'tutor_name',
            key: 'tutor_name'
        },
        {
            title: 'Approve State',
            dataIndex: 'state',
            key: 'state',
            render: renderState
        },
    ];

    if(user.type === 'tutor'){
        columns.push({
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={()=>{onChangeBookingState(record._id, 'accept')}}>Accept</Button>
                    <Button size="small" danger onClick={()=>{onChangeBookingState(record._id, 'reject')}}>Reject</Button>
                </Space>
            ),
        })
    }

    const queryList = () => {
        const user = getLoginUser()
        get('/booking/list', {
            user_type: user.type,
            user_id: user._id
        }).then(response => {
            const list = response.data.map(x=>{
                if(x.student && x.student.length > 0){
                    x.nickname = x.student[0].nickname
                }
                if(x.tutor && x.tutor.length > 0){
                    x.tutor_name = x.tutor[0].nickname
                }

                return x
            })
            setBookingList(list)
        })
    }

    useEffect(() => {
        queryList()
    }, []);

    return (
        <div className="c-main" style={{overflowY: 'auto'}}>
            <Table rowKey={record=>record._id} columns={columns} dataSource={bookingList}/>
        </div>
    )
}
