import React, { Component, useState } from 'react'
import { Tag, Form, Card, Avatar, Modal } from 'antd'
import Rating from '@material-ui/lab/Rating'
import './index.css'

const TutorCard = (props) => {
    const { data } = props
    const [open, setOpen] = useState(false)

    const title = <div>
        {data.nickname}
        <div className="tutors-head">
            <Tag color="#f50">Faculties: {data.faculty}</Tag>
            <div className="tutors-card-content-title">
                <Rating name="read-only" value={data.avgScore} readOnly />
                <span className="RatingText">{data.avgScore}</span>
            </div>
        </div>
    </div>

    return (
        <>
            <Card className="tutor-card" key={data._id} hoverable>
                <Card.Meta
                    avatar={<Avatar src={'/image/' + data.avatar}/>}
                    title={title}
                    description={data.bio}
                />
            </Card>

            <Modal open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
                <div>
                    <Form
                        name="basic"
                        initialValues={{ content: '' }}
                        autoComplete="off">
                        <Form.Item label="Tutor name">
                            {data.nickname}
                        </Form.Item>
                        <Form.Item label="Faculties">
                            {data.faculty}
                        </Form.Item>
                        <Form.Item label="Profile">
                            {data.bio}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default TutorCard
