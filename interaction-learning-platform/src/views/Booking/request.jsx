import React, { useState, useEffect, Modal } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './index.css'
import { get, getLoginUser, post } from '../../util/request'

export default function BookingRequest() {
    const navigate = useNavigate()
    const { state } = useLocation()
    console.log(state)

    const timeSlots = [
        '00:00-02:00',
        '02:00-04:00',
        '04:00-06:00',
        '06:00-08:00',
        '08:00-10:00',
        '10:00-12:00',
        '12:00-14:00',
        '14:00-16:00',
        '16:00-18:00',
        '18:00-20:00',
        '20:00-22:00',
        '22:00-00:00',
    ]
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    useEffect(() => {
        const todayInSydney = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Australia/Sydney',
        })
        document.getElementById('datePicker').setAttribute('min', todayInSydney)
    }, [])

    const handleBooking = () => {
        if (!date || !time) {
            Modal.error({
                content: 'Please select a date and time slot!',
            });
        } else {
            const user = getLoginUser()
            post('/course/booking', {
                student_user_id: user._id,
                username: user.username,
                course_id: state._id,
                course_name: state.name,
                tutor_user_id: state.tutor_user_id,
                date,
                time,
            }).then(response => {
                if (response.data.code === 0) {
                    alert(`Requested appointment for 【${state.name}】 on ${date} at ${time}.`)
                    navigate(`/home/course`)
                } else {
                    alert(response.data.message)
                }
            })
        }
    }
    return (
        <div className="c-main">
            <div className="BookingRequest-title">Appointment Scheduling</div>

            <div className="appointment-section">
                <label>Course:</label>
                <div>
                    {state.name}
                </div>

                <label>Select a date:</label>
                <input
                    type="date"
                    id="datePicker"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <label>Select a time slot:</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                    {timeSlots.map((t) => (
                        <option value={t} key={t}>
                            {t}
                        </option>
                    ))}
                </select>

                <button onClick={handleBooking}>Request Appointment</button>
            </div>
        </div>
    )
}
