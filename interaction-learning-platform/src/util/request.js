import axios from 'axios'

const base = 'http://localhost:3001'

export const get = (route, params) =>{
    return axios.get(`${base}${route}`, { params })
}

export const post = (route, data) =>{
    return axios.post(`${base}${route}`, data)
}

export const getLoginUser = () => {
    const user = localStorage.getItem("login_user")
    return JSON.parse(user)
}
