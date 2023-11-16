import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './index.css'
import EventNote from '@material-ui/icons/EventNote'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Card, CardContent, Divider } from '@material-ui/core'
import { Menu, Modal, Avatar } from 'antd'
import { get, getLoginUser, post } from '../../util/request'

const Home = () => {
  const navigate = useNavigate()
  const [loginUser, setLoginUser] = useState({})
  const [menuItems, setMenuItems] = useState([]) // 菜单

  useEffect(() => {
    const user = getLoginUser()
    if(user) {
      setLoginUser(user) // state是副作用，不能马上生效

      if(user.type === 'admin'){
        setMenuItems([
          { label: 'Profile', key: '/home/profile' },
          { label: 'Reset Password', key: '/home/resetPwd' },
          { label: 'Course Information', key: '/home/course' },
          { label: 'Tutors Information', key: '/home/tutor' },
          { label: 'User Management', key: '/home/user' },
          { label: 'Course Management', key: '/home/courseManage' }
        ])
      }else if(user.type === 'tutor'){
        setMenuItems([
          { label: 'Profile', key: '/home/profile' },
          { label: 'Reset Password', key: '/home/resetPwd' },
          { label: 'Course Information', key: '/home/course' },
          { label: 'Tutors Information', key: '/home/tutor' },
          { label: 'Booking Request', key: '/home/bookingList' },
        ])
      }else if(user.type === 'student'){
        setMenuItems([
          { label: 'Profile', key: '/home/profile' },
          { label: 'Reset Password', key: '/home/resetPwd' },
          { label: 'Course Information', key: '/home/course' },
          { label: 'Tutors Information', key: '/home/tutor' },
          { label: 'Booking Result', key: '/home/bookingList' },
        ])
      }
    } else {
      Modal.error({
        content: 'Please login first',
      });
      navigate(`/`)
    }
  }, [])

  const { search, pathname } = useLocation()
  const [selectedKey, setSelectedKey] = useState(pathname)
  // 根据路由判断选中的菜单项，并更新 selectedKeys
  useEffect(() => {
    setSelectedKey(pathname)
  }, [pathname])

  const params = new URLSearchParams(search)

  const to = (e) => {
    console.log('click ', e)
    navigate(e.key)
    setSelectedKey(e.key)
  }

  const onLogout = () => {
    localStorage.removeItem('login_user')
    navigate('/')
  }

  return (
    <div>
      <header className="header">
        <div className="title">
          <EventNote fontSize="large" />
          <span style={{ fontSize: '20px' }}>Appointment platform</span>
        </div>
        <div className="title" style={{marginRight: 60, cursor: 'pointer', gap: 0}} onClick={onLogout}>
          <ExitToAppIcon fontSize="large" />
          <span style={{ fontSize: '20px' }}>Exit</span>
        </div>
      </header>
      <main className="content">
        <div className="content-left">
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <div className="content-left-header">
                <Avatar src={'/image/' + loginUser.avatar} />
                <div
                  style={{
                    margin: '10px 7px',
                    fontSize: '16px',
                  }}>
                  <span>{loginUser.nickname}</span>
                  <span className="user-type">({loginUser.type})</span>
                </div>
              </div>
              <Divider />
              <Menu
                selectedKeys={[selectedKey]}
                onClick={to}
                className="menu-item"
                style={{ fontsize: 16 }}
                items={menuItems}
              />
            </CardContent>
          </Card>
        </div>
        <div className="content-right">
          {/* 二级路由出口 */}
          <Outlet></Outlet>
        </div>
      </main>
    </div>
  )
}

export default Home
