import React, { useState,useEffect } from 'react'
import './index.css'
import {
    AppBar,
    Toolbar,
    Select,
    MenuItem,
    Container,
} from '@mui/material'
import { Button, Form, Input, Modal } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Course from '../Course'
import i18n from './i18n'
import logo from '../../assets/img/zhulogo.png'
import { get, post } from '../../util/request'

function Login() {
    const formRef = React.useRef(null);
    const loginFormRef = React.useRef(null);
    const [language, setLanguage] = useState('en')
    const [open, setOpen] = useState(false)
    const [openLogin, setOpenLogin] = useState(false)
    const [googleId, setGoogleId] = useState('')
    const { t } = useTranslation()
    const navigate = useNavigate()

    function onRegisterClick() {
        navigate(`/register`)
    }

    function handleCredentialResponse(response) {
        get('/user/queryUsernameByGoogleId', {google_id: response.clientId}).then((resp) => {
            if(resp.data.code === 0) {
                localStorage.setItem("login_user", JSON.stringify(resp.data.user))
                navigate(`/home`)
            } else {
                // 还没关联账号
                setOpen(true)
                setGoogleId(response.clientId)
            }
        })
    }

    useEffect(()=>{
        if(window.google && window.google.accounts){
            window.google.accounts.id.initialize({
                client_id: "581788333114-la4s2hfq8i42pv52oe5lkrfhovcr56im.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });
            window.google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "medium" }  // customization attributes
            );
            window.google.accounts.id.prompt(); // also display the One Tap dialog
        }
    }, [])


    // login callback
    const onFinish = (values) => {
        get('/user/login', values).then(request => {
            if (request.data.code === 0) {
                localStorage.setItem("login_user", JSON.stringify(request.data.user))

                navigate(`/home`)
            } else {
                Modal.error({
                    content: request.data.message,
                });
            }
        })
    };

    const startAssociateGoogle = (values) =>{
        post('/user/google/associate', {
            googleId,
            username: values.username
        }).then(response => {
            if (response.data.code === 0) {
                localStorage.setItem("login_user", JSON.stringify(response.data.user))
                navigate(`/home`)
            }
        })
        setOpen(false)
    }

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value
        setLanguage(newLanguage)
        i18n.changeLanguage(newLanguage)
    }

    return (
        <div>
            {/*google account associate*/}
            <Modal open={open} onOk={()=>formRef.current.submit()} onCancel={() => setOpen(false)}>
                <Form
                    ref={formRef}
                    name="account"
                    layout={'vertical'}
                    initialValues={{content: ''}}
                    onFinish={startAssociateGoogle}
                    autoComplete="off">
                    <Form.Item label="Associate username and google account" name="username">
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>

            {/*login modal dialog*/}
            <Modal title="Login Now" open={openLogin} onOk={()=>loginFormRef.current.submit()} onCancel={() => setOpenLogin(false)}>
                <Form
                    ref={loginFormRef}
                    name="loginForm"
                    layout='vertical'
                    onFinish={onFinish} >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}>
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <AppBar position="static">
                <Toolbar>
                    <div className="platform-name">
                        {t('platformName')}
                        {/*{t('platformDescription')}*/}
                    </div>
                    <div className="header-menu">
                        {/*<div className="header-title">{t('home')}</div>
                        <div className="header-title">{t('course Information')}</div>
                        <div className="header-title">{t('unitsOfStudy')}</div>*/}
                        <div className="header-title"></div>
                    </div>

                    <Button type="primary" onClick={()=>{setOpenLogin(true)}} style={{ width: 80,backgroundColor:'rgb(255, 153, 0)' }}>
                        {t('loginNow')}
                    </Button>
                    <Button type="primary" onClick={onRegisterClick} style={{
                        width: 80,
                        marginLeft: 10,
                        backgroundColor:'rgb(255, 153, 0)'
                    }}>
                        {t('registerNow')}
                    </Button>

                    <Select
                        id="nav_language_select"
                        value={language}
                        onChange={handleLanguageChange}
                        style={{ fontSize: 16,color: 'white' }}>
                        <MenuItem value="en">{t('English')}</MenuItem>
                        <MenuItem value="zh_CN">{t('简体中文')}</MenuItem>
                        <MenuItem value="zh_TW">{t('繁體中文')}</MenuItem>
                    </Select>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Course openLoginDialog={()=>{setOpenLogin(true)}}/>
            </Container>
        </div>
    )
}

export default Login
