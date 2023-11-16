import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
import CurCard from './components/card/index'
import { get } from "../../util/request";
import { Input } from 'antd';

export default function Reservation() {
    const navigate = useNavigate()

    const [tutorList, setTutorList] = useState([])
    const [tutorListCache, setTutorListCache] = useState([])

    useEffect(() => {
        get('/user/tutor/list').then(response => {
            const list = response.data.map(x => {
                let sum = 0
                for(let o of x.course_booking){
                    sum += o.score
                }
                if(sum === 0){
                    x.avgScore = 0
                } else {
                    x.avgScore = (sum / x.course_booking.length).toFixed(0)
                }

                return x
            })
            setTutorList(list)
            setTutorListCache(list)
        })
    }, []);

    function onSearch(value){
        const result = tutorListCache.filter(x => x.nickname.includes(value))
        setTutorList(result)
    }

    return (
        <div className="c-main">
            <Input.Search
                placeholder="Input tutor's name..."
                allowClear
                enterButton="Search"
                size="large"
                style={{
                    width: 600,
                    marginBottom: 10,
                }}
                onSearch={onSearch}
            />

            <div className="card-list">
                {tutorList.map((obj, index) => {
                    return (
                        <CurCard data={obj} key={index}/>
                    )
                })}
            </div>
        </div>
    )
}
