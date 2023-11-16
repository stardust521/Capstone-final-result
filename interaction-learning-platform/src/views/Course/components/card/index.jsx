import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
import { Card, Tag,Button,Modal,Rate,List,Avatar } from 'antd'
import { ShoppingCartOutlined,MessageOutlined,RedoOutlined } from '@ant-design/icons';
import { get, getLoginUser } from '../../../../util/request'

// <CurCard data={xxx}/>
const CourseCard = (props) => {
    const { data } = props
    const [open, setOpen] = useState(false)
    const [score, setScore] = useState(0)
    const [commentList, setCommentList] = useState([])

    // const img = require('../../../../assets/img/' + data.cover_img)
    const img = 'http://localhost:3001/' + data.cover_img

    const navigate = useNavigate()

    function onBooking(obj) {
        const user = getLoginUser()
        if(!user) {
            // not login
            props.booking() // call parent method
        }else {
            navigate(`/home/bookingRequest`, {
                state: obj // state is a constant key
            })
        }
    }

    function onOpenCommentDialog(){
        get('/booking/list', {
        }).then(resp => {
            const courseId = data._id
            const matchArray = resp.data.filter(x => x.course_id == courseId)
            const totalScore = matchArray.map(x => x.score).reduce((a,b) => a + b, 0)
            if(matchArray.length == 0){
                setScore(0)
            }else{
                setScore(totalScore / matchArray.length)
            }
            setOpen(true)
        })
    }

    // 评论内容
    const cList = [
        {
            name: 'Tom',
            desc: 'The courses at university have been very informative, providing a broad range of knowledge in various fields.'
        },
        {
            name: 'Lin',
            desc: 'The teaching style of the professors has been exceptional, ensuring a deep understanding of the subject matter.'
        },
        {
            name: 'Jam',
            desc: 'The practical elements of the courses have been particularly useful, giving an opportunity to apply the theory learned in real-world situations.'
        },
        {
            name: 'Bill',
            desc: 'The workload has been reasonable, allowing for sufficient time to digest and understand the material.'
        },
        {
            name: 'Kobe',
            desc: 'The courses have effectively equipped me with the skills and knowledge needed to succeed in my chosen field.'
        },
        {
            name: 'Sam',
            desc: 'The variety of courses offered has been excellent, providing an opportunity to explore different interests and areas of study.'
        }
    ];

    function onRefreshComment(){
        setCommentList(cList.sort(() => Math.random() - 0.5).slice(0,3))
    }

    useEffect(() => {
        onRefreshComment()
    }, []);


    return (
        <>
            <Modal title="Comment" open={open} onOk={()=>setOpen(false)} onCancel={() => setOpen(false)}>
                <div className="comment-refresh">
                    <Rate value={score} disabled />
                    <Button icon={<RedoOutlined />} onClick={onRefreshComment}>
                        Refresh
                    </Button>
                </div>
                <List
                    itemLayout="horizontal"
                    dataSource={commentList}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={'/image/4.png'}/>}
                                title={item.name}
                                description={item.desc}
                            />
                        </List.Item>
                    )}
                />
            </Modal>

            <Card className="my-card" key={data._id} cover={<img src={img}/>}>
                <div style={{ position: 'absolute', top: '5px', }}>
                    <Tag color="#f50" >Tutor: {data.tutor.nickname}</Tag>
                </div>

                <Card.Meta title={data.name} description={data.description}/>

                <div>
                    <Button type="link" size="small" style={{marginTop:4}} onClick={onOpenCommentDialog}>
                        <MessageOutlined />Comment
                    </Button>

                    <Button type="link" size="small" style={{marginTop:4,color:'#ff4d4f'}} onClick={() => {
                        onBooking(data)
                    }}>
                        <ShoppingCartOutlined />Booking Now
                    </Button>
                </div>
            </Card>
        </>
    )
}

export default CourseCard
