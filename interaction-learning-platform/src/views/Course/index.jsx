import React, { useEffect, useState } from 'react'

import './index.css'
import CourseCard from './components/card/index'
import { get } from "../../util/request";
import { Input } from 'antd';

export default function Reservation(props) {
    const [courseList, setCourseList] = useState([])
    const [courseListCache, setCourseListCache] = useState([])

    useEffect(() => {
        get('/course/list').then(response => {
            setCourseList(response.data)
            setCourseListCache(response.data)
        })
    }, []);

    function onSearch(value){
        const result = courseListCache.filter(x => x.name.includes(value))
        setCourseList(result)
    }

    function booking() {
        props.openLoginDialog()
    }

    return (
        <div className="c-main">
            <Input.Search
                placeholder="Input course name..."
                allowClear
                enterButton="Search"
                size="large"
                style={{
                    width: 1000,
                    marginBottom: 10,
                }}
                onSearch={onSearch}
            />

            <div className="card-list">
                {courseList.map((obj, index) => {
                    return (
                        <CourseCard data={obj} key={index} booking={booking}/>
                    )
                })}
            </div>
        </div>
    )
}
