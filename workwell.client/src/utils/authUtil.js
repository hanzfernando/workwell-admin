const getToken = () => {
    const token = localStorage.getItem('token')
    return token
}

//const getUidToken = () => {
//    const token = localStorage.getItem('userUid')
//    return token
//}

const setToken = (token) => {
    localStorage.setItem('token', token)
}

const removeToken = () => {
    localStorage.removeItem('token')
}

export { getToken, setToken, removeToken }


    
