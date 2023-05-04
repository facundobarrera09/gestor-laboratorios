const logoutUrl = 'http://localhost:3001/api/logout'

const logout = () => {
    if (userData) {
        $.ajax({
            url: logoutUrl,
            headers: { 'Authorization': `Bearer ${userData.access_token}` },
            type: 'POST',
            success: (response) => {
                localStorage.removeItem('userLoginData')
                sessionStorage.removeItem('userLoginData')
                window.location.assign('/')
            },
            error: (error) => {
                localStorage.removeItem('userLoginData')
                sessionStorage.removeItem('userLoginData')
                window.location.assign('/')
            }
        })
    }
    else {
        window.location.assign('/')
    }
}

const loadUserLoginData = () => {
    return JSON.parse(localStorage.getItem('userLoginData'))
}