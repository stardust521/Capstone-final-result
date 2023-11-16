import React, { lazy } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

import Profile from '../views/Profile'
import ResetPwd from '../views/ResetPwd'
import User from '../views/Admin/user'
import CourseManage from '../views/Admin/course'
import BookingRequest from '../views/Booking/request'
import BookingList from '../views/Booking/list'
import Course from '../views/Course'
import Register from '../views/Register'
import Tutor from '../views/Tutor'

const Login = lazy(() => import('../views/Login'))
const Home = lazy(() => import('../views/Home'))
const NotFond = lazy(() => import('../views/NotFond'))

const Routes = () => {
  const router = useRoutes([
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/home', element: <Navigate to="/home/profile" /> }, // Navigate 重定向
    {
      path: '/home',
      element: <Home />,
      children: [
        { path: 'profile', element: <Profile /> },
        { path: 'user', element: <User /> },
        { path: 'courseManage', element: <CourseManage /> },
        { path: 'bookingRequest', element: <BookingRequest /> },
        { path: 'bookingList', element: <BookingList /> },
        { path: 'course', element: <Course /> },
        { path: 'tutor', element: <Tutor /> },
        { path: 'resetPwd', element: <ResetPwd /> },
      ],
    },
    { path: '*', element: <NotFond /> },
  ])
  return router
}

export default Routes
